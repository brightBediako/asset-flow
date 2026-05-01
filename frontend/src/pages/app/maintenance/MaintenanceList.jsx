import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button, Card, Input, Select } from '@/components/ui/BaseComponents';
import { formatDate } from '@/lib/utils';
import { Wrench, CheckCircle2, Trash2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function MaintenanceList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [params, setParams] = useState({ page: 0, size: 10, q: '' });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    organizationId: '',
    assetId: '',
    description: '',
  });

  const isOrgAdmin = user?.role === 'ORG_ADMIN';
  const defaultOrganizationId = user?.organization?.id ? String(user.organization.id) : '';

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['maintenance', params],
    queryFn: async () => {
      const resp = await apiClient.get('/maintenance-records', {
        params: isOrgAdmin && defaultOrganizationId ? { organizationId: defaultOrganizationId } : {},
      });
      return resp.data;
    },
  });

  const filteredRecords = useMemo(() => {
    const term = (params.q || '').trim().toLowerCase();
    if (!term) return records;
    return records.filter((row) => {
      const haystack = `${row.asset?.name || ''} ${row.description || ''} ${row.createdBy?.fullName || ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [records, params.q]);

  const organizationsQuery = useQuery({
    queryKey: ['maintenance-organizations-options'],
    queryFn: async () => {
      const resp = await apiClient.get('/organizations');
      return resp.data;
    },
    enabled: !isOrgAdmin,
  });

  const assetsQuery = useQuery({
    queryKey: ['maintenance-assets-options', form.organizationId || defaultOrganizationId],
    queryFn: async () => {
      const organizationId = form.organizationId || defaultOrganizationId;
      const resp = await apiClient.get('/assets', {
        params: organizationId ? { organizationId } : {},
      });
      return resp.data;
    },
    enabled: Boolean(form.organizationId || defaultOrganizationId),
  });

  const createRecord = useMutation({
    mutationFn: async (payload) => {
      const resp = await apiClient.post('/maintenance-records', payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success('Maintenance record created');
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      setShowForm(false);
      setForm({ organizationId: isOrgAdmin ? defaultOrganizationId : '', assetId: '', description: '' });
    },
  });

  const updateRecord = useMutation({
    mutationFn: async ({ id, payload }) => {
      const resp = await apiClient.put(`/maintenance-records/${id}`, payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success('Maintenance record updated');
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });

  const deleteRecord = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/maintenance-records/${id}`);
    },
    onSuccess: () => {
      toast.success('Maintenance record deleted');
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });

  const organizationOptions = useMemo(() => {
    if (isOrgAdmin) {
      return [{ label: user?.organization?.name || 'My Organization', value: defaultOrganizationId }];
    }
    return (organizationsQuery.data || []).map((org) => ({ label: org.name, value: String(org.id) }));
  }, [isOrgAdmin, user, defaultOrganizationId, organizationsQuery.data]);

  const assetOptions = useMemo(
    () => (assetsQuery.data || []).map((asset) => ({ label: asset.name, value: String(asset.id) })),
    [assetsQuery.data]
  );

  const submitCreate = (e) => {
    e.preventDefault();
    const organizationId = form.organizationId || defaultOrganizationId;
    if (!organizationId || !form.assetId || !form.description.trim()) {
      toast.error('Organization, asset and description are required');
      return;
    }
    createRecord.mutate({
      organization: { id: Number(organizationId) },
      asset: { id: Number(form.assetId) },
      createdBy: user?.id ? { id: Number(user.id) } : null,
      description: form.description.trim(),
      startedAt: new Date().toISOString(),
    });
  };

  const columns = [
    {
      header: 'Asset / Type',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.asset?.name || '-'}</span>
          <span className="text-xs text-slate-400 font-medium">Repair</span>
        </div>
      )
    },
    {
      header: 'Performed By',
      cell: (row) => row.createdBy?.fullName || row.createdBy?.email || '-'
    },
    {
      header: 'Date',
      cell: (row) => formatDate(row.startedAt, 'MMM dd, yyyy')
    },
    {
      header: 'Status',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {row.completedAt ? (
            <Badge status="APPROVED">Completed</Badge>
          ) : (
            <Badge status="PENDING">In Progress</Badge>
          )}
        </div>
      )
    },
    {
      header: 'Details',
      cell: (row) => row.description
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
           {!row.completedAt && (
             <Button
               variant="outline"
               size="sm"
               className="h-8 gap-1.5 border-emerald-100 text-emerald-600 hover:bg-emerald-50"
               onClick={() =>
                 updateRecord.mutate({
                   id: row.id,
                   payload: { completedAt: new Date().toISOString() },
                 })
               }
             >
               <CheckCircle2 className="h-4 w-4" /> Resolve
             </Button>
           )}
           <Button
             variant="danger"
             size="sm"
             className="h-8"
             onClick={() => {
               if (globalThis.confirm('Delete this maintenance record?')) {
                 deleteRecord.mutate(row.id);
               }
             }}
           >
              <Trash2 className="h-4 w-4" />
           </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {showForm && (
        <Card title="Schedule Maintenance">
          <form className="space-y-4" onSubmit={submitCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Organization"
                value={form.organizationId}
                onChange={(e) => setForm((prev) => ({ ...prev, organizationId: e.target.value, assetId: '' }))}
                options={[{ label: 'Select organization', value: '' }, ...organizationOptions]}
                disabled={isOrgAdmin}
              />
              <Select
                label="Asset"
                value={form.assetId}
                onChange={(e) => setForm((prev) => ({ ...prev, assetId: e.target.value }))}
                options={[{ label: 'Select asset', value: '' }, ...assetOptions]}
              />
            </div>
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe maintenance work..."
            />
            <div className="flex items-center gap-2">
              <Button type="submit" isLoading={createRecord.isPending}>
                Create Record
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <ListLayout
        title="Maintenance Records"
        subtitle="Schedule, complete and remove maintenance records."
        searchPlaceholder="Search maintenance history..."
        onSearch={(v) => setParams(p => ({ ...p, q: v, page: 0 }))}
        isLoading={isLoading}
        data={filteredRecords}
        actions={
          <Button className="gap-2 bg-amber-600 hover:bg-amber-700" onClick={() => setShowForm((v) => !v)}>
            <Wrench className="h-4 w-4" /> Schedule Repair
          </Button>
        }
        columns={columns}
      />
    </div>
  );
}
