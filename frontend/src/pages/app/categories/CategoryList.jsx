import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Button, Input, Select } from '@/components/ui/BaseComponents';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoryList() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState({ page: 0, size: 20, q: '' });
  const [form, setForm] = useState({ organizationId: 'GLOBAL', name: '' });

  const { data: organizations = [] } = useQuery({
    queryKey: ['category-organizations'],
    queryFn: async () => {
      const resp = await apiClient.get('/organizations');
      return resp.data;
    },
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', form.organizationId],
    queryFn: async () => {
      const resp = await apiClient.get('/asset-categories', {
        params: form.organizationId && form.organizationId !== 'GLOBAL' ? { organizationId: form.organizationId } : {},
      });
      return resp.data;
    },
    enabled: true,
  });

  const createCategory = useMutation({
    mutationFn: async (payload) => {
      const resp = await apiClient.post('/asset-categories', payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success('Category created');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setForm((prev) => ({ ...prev, name: '' }));
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, payload }) => {
      const resp = await apiClient.put(`/asset-categories/${id}`, payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success('Category updated');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/asset-categories/${id}`);
    },
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const organizationOptions = useMemo(
    () => organizations.map((org) => ({ label: org.name, value: String(org.id) })),
    [organizations]
  );

  const filteredRows = useMemo(() => {
    const term = (params.q || '').trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((row) => (row.name || '').toLowerCase().includes(term));
  }, [categories, params.q]);

  const columns = [
    {
      header: 'Category',
      accessor: 'name',
    },
    {
      header: 'Scope',
      cell: (row) => (row.organization?.id ? row.organization?.name : 'GLOBAL'),
    },
    {
      header: 'ID',
      accessor: 'id',
      className: 'font-mono text-xs',
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const nextName = globalThis.prompt('Rename category', row.name);
              if (nextName && nextName.trim() && nextName.trim() !== row.name) {
                updateCategory.mutate({
                  id: row.id,
                  payload: {
                    name: nextName.trim(),
                    organization: row.organization?.id ? { id: Number(row.organization.id) } : null,
                  },
                });
              }
            }}
          >
            Rename
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (globalThis.confirm(`Delete category "${row.name}"?`)) {
                deleteCategory.mutate(row.id);
              }
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ListLayout
      title="Asset Categories"
      subtitle="System admin category CRUD by organization."
      searchPlaceholder="Search categories..."
      onSearch={(q) => setParams((prev) => ({ ...prev, q, page: 0 }))}
      isLoading={isLoading}
      data={filteredRows}
      columns={columns}
      actions={
        <div className="flex items-end gap-2">
          <Select
            className="w-56"
            label="Organization"
            value={form.organizationId}
            onChange={(e) => setForm((prev) => ({ ...prev, organizationId: e.target.value }))}
            options={[{ label: 'GLOBAL (All organizations)', value: 'GLOBAL' }, ...organizationOptions]}
          />
          <Input
            label="Category name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Laptops"
          />
          <Button
            className="gap-2"
            onClick={() => {
              if (!form.name.trim()) {
                toast.error('Enter category name');
                return;
              }
              createCategory.mutate({
                name: form.name.trim(),
                organization: null,
              });
            }}
            isLoading={createCategory.isPending}
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      }
      emptyMessage="No categories found for selected organization."
    />
  );
}

