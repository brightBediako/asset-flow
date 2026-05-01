import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button, Card, Input, Select } from '@/components/ui/BaseComponents';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, Plus, X, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function BookingList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [params, setParams] = useState({ page: 0, size: 10, q: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    organizationId: '',
    assetId: '',
    userId: '',
    startTime: '',
    endTime: '',
  });

  const isOrgAdmin = user?.role === 'ORG_ADMIN';
  const defaultOrganizationId = user?.organization?.id ? String(user.organization.id) : '';

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', params],
    queryFn: async () => {
      const resp = await apiClient.get('/bookings/search', {
        params: {
          ...params,
          ...(isOrgAdmin && defaultOrganizationId ? { organizationId: defaultOrganizationId } : {}),
        },
      });
      return resp.data;
    },
  });

  const organizationsQuery = useQuery({
    queryKey: ['booking-organizations-options'],
    queryFn: async () => {
      const resp = await apiClient.get('/organizations');
      return resp.data;
    },
    enabled: !isOrgAdmin,
  });

  const usersQuery = useQuery({
    queryKey: ['booking-users-options', form.organizationId || defaultOrganizationId],
    queryFn: async () => {
      const organizationId = form.organizationId || defaultOrganizationId;
      const resp = await apiClient.get('/users', {
        params: organizationId ? { organizationId } : {},
      });
      return resp.data;
    },
    enabled: Boolean(form.organizationId || defaultOrganizationId),
  });

  const assetsQuery = useQuery({
    queryKey: ['booking-assets-options', form.organizationId || defaultOrganizationId],
    queryFn: async () => {
      const organizationId = form.organizationId || defaultOrganizationId;
      const resp = await apiClient.get('/assets', {
        params: organizationId ? { organizationId } : {},
      });
      return resp.data;
    },
    enabled: Boolean(form.organizationId || defaultOrganizationId),
  });

  const createBooking = useMutation({
    mutationFn: async (payload) => {
      const resp = await apiClient.post('/bookings', payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success('Booking created');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setShowCreateForm(false);
      setForm({
        organizationId: isOrgAdmin ? defaultOrganizationId : '',
        assetId: '',
        userId: '',
        startTime: '',
        endTime: '',
      });
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, payload }) => {
      const resp = await apiClient.put(`/bookings/${id}`, payload);
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const deleteBooking = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/bookings/${id}`);
    },
    onSuccess: () => {
      toast.success('Booking deleted');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const organizationOptions = useMemo(() => {
    if (isOrgAdmin) {
      return [{ label: user?.organization?.name || 'My Organization', value: defaultOrganizationId }];
    }
    return (organizationsQuery.data || []).map((org) => ({ label: org.name, value: String(org.id) }));
  }, [isOrgAdmin, user, defaultOrganizationId, organizationsQuery.data]);

  const userOptions = useMemo(
    () => (usersQuery.data || []).map((u) => ({ label: `${u.fullName || u.email} (${u.email})`, value: String(u.id) })),
    [usersQuery.data]
  );
  const assetOptions = useMemo(
    () => (assetsQuery.data || []).map((a) => ({ label: a.name, value: String(a.id) })),
    [assetsQuery.data]
  );

  const submitCreate = (e) => {
    e.preventDefault();
    const organizationId = form.organizationId || defaultOrganizationId;
    if (!organizationId || !form.assetId || !form.userId || !form.startTime || !form.endTime) {
      toast.error('All booking fields are required');
      return;
    }
    createBooking.mutate({
      organization: { id: Number(organizationId) },
      asset: { id: Number(form.assetId) },
      user: { id: Number(form.userId) },
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
    });
  };

  const transitionStatus = (row, status) => {
    updateBooking.mutate(
      {
        id: row.id,
        payload: {
          status,
          ...(status === 'APPROVED' ? { approvedBy: { id: user?.id } } : {}),
          ...(status === 'COMPLETED' ? { checkedOutAt: new Date().toISOString() } : {}),
        },
      },
      {
        onSuccess: () => toast.success(`Booking ${status.toLowerCase()}`),
      }
    );
  };

  const columns = [
    {
      header: 'Asset',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.asset?.name || '-'}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.asset?.id || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Reserved By',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
            {(row.user?.fullName || row.user?.email || '?').charAt(0)}
          </div>
          <span className="font-medium text-slate-700">{row.user?.fullName || row.user?.email || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Start Date',
      cell: (row) => formatDate(row.startTime),
    },
    {
      header: 'End Date',
      cell: (row) => formatDate(row.endTime),
    },
    {
      header: 'Status',
      cell: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'PENDING' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 text-rose-600 hover:bg-rose-50 border-rose-100"
                onClick={() => transitionStatus(row, 'REJECTED')}
              >
                <XCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="h-8 bg-emerald-600 hover:bg-emerald-700 border-none"
                onClick={() => transitionStatus(row, 'APPROVED')}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </>
          )}
          {row.status === 'APPROVED' && (
            <Button size="sm" className="h-8 bg-slate-900 hover:bg-slate-800" onClick={() => transitionStatus(row, 'COMPLETED')}>
              Complete
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            className="h-8"
            onClick={() => {
              if (globalThis.confirm(`Delete booking #${row.id}?`)) {
                deleteBooking.mutate(row.id);
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
    <div className="space-y-6">
      {showCreateForm && (
        <Card title="Create Booking">
          <form className="space-y-4" onSubmit={submitCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Organization"
                value={form.organizationId}
                onChange={(e) => setForm((prev) => ({ ...prev, organizationId: e.target.value, userId: '', assetId: '' }))}
                options={[{ label: 'Select organization', value: '' }, ...organizationOptions]}
                disabled={isOrgAdmin}
              />
              <Select
                label="User"
                value={form.userId}
                onChange={(e) => setForm((prev) => ({ ...prev, userId: e.target.value }))}
                options={[{ label: 'Select user', value: '' }, ...userOptions]}
              />
              <Select
                label="Asset"
                value={form.assetId}
                onChange={(e) => setForm((prev) => ({ ...prev, assetId: e.target.value }))}
                options={[{ label: 'Select asset', value: '' }, ...assetOptions]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Start"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
                />
                <Input
                  label="End"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" isLoading={createBooking.isPending}>
                Create Booking
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreateForm(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <ListLayout
        title="Booking Requests"
        subtitle="Approve, reject, complete, create and delete reservations."
        searchPlaceholder="Search by user or asset..."
        onSearch={(v) => setParams((p) => ({ ...p, q: v, page: 0 }))}
        isLoading={isLoading}
        data={data?.content || []}
        pagination={data}
        onPageChange={(p) => setParams((old) => ({ ...old, page: p }))}
        actions={
          <Button className="gap-2" onClick={() => setShowCreateForm((v) => !v)}>
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        }
        columns={columns}
      />
    </div>
  );
}
