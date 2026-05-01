import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Button, Card, Input } from '@/components/ui/BaseComponents';
import { Building2, Pencil, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrganizationList() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState({ page: 0, size: 10, q: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['organizations', params],
    queryFn: async () => {
      const resp = await apiClient.get('/organizations/search', { params });
      return resp.data;
    },
  });

  const upsertOrganization = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        const resp = await apiClient.put(`/organizations/${editingId}`, payload);
        return resp.data;
      }
      const resp = await apiClient.post('/organizations', payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success(editingId ? 'Organization updated' : 'Organization created');
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      resetForm();
    },
  });

  const deleteOrganization = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/organizations/${id}`);
    },
    onSuccess: () => {
      toast.success('Organization deleted');
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setName('');
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Organization name is required');
      return;
    }
    upsertOrganization.mutate({ name: trimmed });
  };

  const columns = [
    {
      header: 'Organization',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 bg-blue-50 rounded-xl flex items-center justify-center text-[#2563EB]">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#0F172A]">{row.name}</span>
            <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
              Joined {new Date(row.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'ID',
      accessor: 'id',
      className: 'font-mono text-[10px]',
    },
    {
      header: 'Created',
      cell: (row) => new Date(row.createdAt).toLocaleString(),
      className: 'font-semibold text-slate-700',
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => {
              setEditingId(row.id);
              setName(row.name || '');
              setShowForm(true);
            }}
          >
            <Pencil className="h-4 w-4 text-slate-500" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => {
              if (globalThis.confirm(`Delete organization "${row.name}"?`)) {
                deleteOrganization.mutate(row.id);
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
        <Card title={editingId ? 'Edit Organization' : 'Create Organization'}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              label="Organization name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corporation"
            />
            <div className="flex items-center gap-2">
              <Button type="submit" isLoading={upsertOrganization.isPending}>
                {editingId ? 'Update Organization' : 'Create Organization'}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <ListLayout
        title="Managed Organizations"
        subtitle="Create, update and remove organizations."
        searchPlaceholder="Search organizations by name or ID..."
        onSearch={(v) => setParams((p) => ({ ...p, q: v, page: 0 }))}
        isLoading={isLoading}
        data={data?.content || []}
        pagination={data}
        onPageChange={(p) => setParams((old) => ({ ...old, page: p }))}
        actions={
          <Button
            className="gap-2"
            onClick={() => {
              setEditingId(null);
              setName('');
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" /> New Entity
          </Button>
        }
        columns={columns}
      />
    </div>
  );
}
