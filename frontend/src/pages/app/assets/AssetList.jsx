import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button, Card, Input, Select } from '@/components/ui/BaseComponents';
import { formatDate } from '@/lib/utils';
import { ASSET_STATUS } from '@/constants/enums';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function AssetList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [params, setParams] = useState({ page: 0, size: 10, q: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    status: ASSET_STATUS.AVAILABLE,
    organizationId: '',
    categoryId: '',
  });

  const isOrgAdmin = user?.role === 'ORG_ADMIN';
  const defaultOrganizationId = user?.organization?.id ? String(user.organization.id) : '';

  const organizationsQuery = useQuery({
    queryKey: ['organizations-options'],
    queryFn: async () => {
      const resp = await apiClient.get('/organizations');
      return resp.data;
    },
    enabled: !isOrgAdmin,
  });

  const categoriesQuery = useQuery({
    queryKey: ['asset-categories-options', form.organizationId || defaultOrganizationId],
    queryFn: async () => {
      const organizationId = form.organizationId || defaultOrganizationId;
      const resp = await apiClient.get('/asset-categories', {
        params: organizationId ? { organizationId } : {},
      });
      return resp.data;
    },
    enabled: Boolean(form.organizationId || defaultOrganizationId),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['assets', params],
    queryFn: async () => {
      const scopedOrganizationId = isOrgAdmin ? defaultOrganizationId : undefined;
      const resp = await apiClient.get('/assets/search', {
        params: {
          page: params.page,
          size: params.size,
          q: params.q,
          ...(scopedOrganizationId ? { organizationId: scopedOrganizationId } : {}),
        },
      });
      return resp.data;
    },
  });

  const upsertAsset = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        const resp = await apiClient.put(`/assets/${editingId}`, payload);
        return resp.data;
      }
      const resp = await apiClient.post('/assets', payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success(editingId ? 'Asset updated successfully' : 'Asset created successfully');
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      resetForm();
    },
  });

  const deleteAsset = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/assets/${id}`);
    },
    onSuccess: () => {
      toast.success('Asset deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      imageUrl: '',
      status: ASSET_STATUS.AVAILABLE,
      organizationId: isOrgAdmin ? defaultOrganizationId : '',
      categoryId: '',
    });
  }

  const organizationOptions = useMemo(() => {
    if (isOrgAdmin) {
      return [{ label: user?.organization?.name || `Organization ${defaultOrganizationId}`, value: defaultOrganizationId }];
    }
    return (organizationsQuery.data || []).map((org) => ({
      label: org.name,
      value: String(org.id),
    }));
  }, [isOrgAdmin, user, defaultOrganizationId, organizationsQuery.data]);

  const categoryOptions = useMemo(
    () =>
      (categoriesQuery.data || []).map((category) => ({
        label: category.name,
        value: String(category.id),
      })),
    [categoriesQuery.data]
  );

  const beginCreate = () => {
    setEditingId(null);
    setShowForm(true);
    setForm({
      name: '',
      description: '',
      imageUrl: '',
      status: ASSET_STATUS.AVAILABLE,
      organizationId: isOrgAdmin ? defaultOrganizationId : '',
      categoryId: '',
    });
  };

  const beginEdit = (asset) => {
    setEditingId(asset.id);
    setShowForm(true);
    setForm({
      name: asset.name || '',
      description: asset.description || '',
      imageUrl: asset.imageUrl || '',
      status: asset.status || ASSET_STATUS.AVAILABLE,
      organizationId: String(asset.organization?.id || (isOrgAdmin ? defaultOrganizationId : '')),
      categoryId: String(asset.category?.id || ''),
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const organizationId = form.organizationId || defaultOrganizationId;
    if (!form.name.trim()) {
      toast.error('Asset name is required');
      return;
    }
    if (!organizationId) {
      toast.error('Organization is required');
      return;
    }
    if (!form.categoryId) {
      toast.error('Category is required');
      return;
    }

    upsertAsset.mutate({
      name: form.name.trim(),
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      status: form.status,
      organization: { id: Number(organizationId) },
      category: { id: Number(form.categoryId) },
    });
  };

  const columns = [
    {
      header: 'Asset Details',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.name}</span>
          <span className="text-xs text-slate-400 uppercase tracking-tighter mt-0.5">{row.category?.name || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },
    {
      header: 'Organization',
      cell: (row) => row.organization?.name || '-',
    },
    {
      header: 'Category',
      cell: (row) => row.category?.name || '-',
    },
    {
      header: 'Updated',
      cell: (row) => formatDate(row.updatedAt, 'MMM dd, yyyy'),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" title="Edit Asset" onClick={() => beginEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => {
              if (globalThis.confirm(`Delete asset "${row.name}"?`)) {
                deleteAsset.mutate(row.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {showForm && (
        <Card title={editingId ? 'Edit Asset' : 'Create Asset'}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Asset name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Dell Latitude 7440"
              />
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                options={Object.values(ASSET_STATUS).map((status) => ({ label: status, value: status }))}
              />
              <Select
                label="Organization"
                value={form.organizationId}
                onChange={(e) => {
                  const organizationId = e.target.value;
                  setForm((prev) => ({ ...prev, organizationId, categoryId: '' }));
                }}
                options={[
                  { label: 'Select organization', value: '' },
                  ...organizationOptions,
                ]}
                disabled={isOrgAdmin}
              />
              <Select
                label="Category"
                value={form.categoryId}
                onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                options={[
                  { label: 'Select category', value: '' },
                  ...categoryOptions,
                ]}
              />
            </div>
            <Input
              label="Image URL (optional)"
              value={form.imageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
            <div className="space-y-1.5">
              <label htmlFor="asset-description" className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="asset-description"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm transition-all duration-200 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 focus:outline-none"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this asset..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" isLoading={upsertAsset.isPending}>
                {editingId ? 'Update Asset' : 'Create Asset'}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <ListLayout
        title="Asset Inventory"
        subtitle="Create, update and remove assets from your inventory."
        searchPlaceholder="Search by name, category, status..."
        onSearch={(v) => setParams((p) => ({ ...p, q: v, page: 0 }))}
        isLoading={isLoading}
        data={data?.content || []}
        pagination={data}
        onPageChange={(p) => setParams((old) => ({ ...old, page: p }))}
        actions={
          <Button className="gap-2" onClick={beginCreate}>
            <Plus className="h-4 w-4" /> Add Asset
          </Button>
        }
        columns={columns}
      />
    </div>
  );
}
