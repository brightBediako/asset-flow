import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Button, Card, Input, Select } from '@/components/ui/BaseComponents';
import { cn, formatDate } from '@/lib/utils';
import { UserPlus, Pencil, Trash2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function UserList() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [params, setParams] = useState({ page: 0, size: 10, q: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    roleId: '',
    organizationId: '',
  });

  const isOrgAdmin = currentUser?.role === 'ORG_ADMIN';
  const defaultOrganizationId = currentUser?.organization?.id ? String(currentUser.organization.id) : '';

  const { data, isLoading } = useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const resp = await apiClient.get('/users/search', {
        params: {
          page: params.page,
          size: params.size,
          q: params.q,
          ...(isOrgAdmin && defaultOrganizationId ? { organizationId: defaultOrganizationId } : {}),
        },
      });
      return resp.data;
    },
  });

  const rolesQuery = useQuery({
    queryKey: ['roles-options'],
    queryFn: async () => {
      const resp = await apiClient.get('/roles');
      return resp.data;
    },
  });

  const organizationsQuery = useQuery({
    queryKey: ['organizations-options'],
    queryFn: async () => {
      const resp = await apiClient.get('/organizations');
      return resp.data;
    },
    enabled: !isOrgAdmin,
  });

  const createUser = useMutation({
    mutationFn: async (payload) => {
      const resp = await apiClient.post('/auth/register', payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      resetForm();
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, payload }) => {
      const resp = await apiClient.put(`/users/${id}`, payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      resetForm();
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const roleOptions = useMemo(
    () =>
      (rolesQuery.data || []).map((role) => ({
        label: role.name,
        value: String(role.id),
      })),
    [rolesQuery.data]
  );

  const organizationOptions = useMemo(() => {
    if (isOrgAdmin) {
      return [{ label: currentUser?.organization?.name || 'My Organization', value: defaultOrganizationId }];
    }
    return (organizationsQuery.data || []).map((org) => ({
      label: org.name,
      value: String(org.id),
    }));
  }, [isOrgAdmin, currentUser, defaultOrganizationId, organizationsQuery.data]);

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({
      fullName: '',
      email: '',
      password: '',
      roleId: '',
      organizationId: isOrgAdmin ? defaultOrganizationId : '',
    });
  }

  const beginCreate = () => {
    setEditingId(null);
    setShowForm(true);
    setForm({
      fullName: '',
      email: '',
      password: '',
      roleId: '',
      organizationId: isOrgAdmin ? defaultOrganizationId : '',
    });
  };

  const beginEdit = (row) => {
    setEditingId(row.id);
    setShowForm(true);
    setForm({
      fullName: row.fullName || '',
      email: row.email || '',
      password: '',
      roleId: String(row.role?.id || ''),
      organizationId: String(row.organization?.id || (isOrgAdmin ? defaultOrganizationId : '')),
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!form.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!form.roleId) {
      toast.error('Role is required');
      return;
    }
    const organizationId = form.organizationId || defaultOrganizationId;

    if (!editingId) {
      if (!form.password || form.password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
      createUser.mutate({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        roleId: Number(form.roleId),
        organizationId: organizationId ? Number(organizationId) : null,
        accountType: 'USER',
      });
      return;
    }

    updateUser.mutate({
      id: editingId,
      payload: {
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        role: { id: Number(form.roleId) },
        organization: organizationId ? { id: Number(organizationId) } : null,
      },
    });
  };

  const columns = [
    {
      header: 'User identity',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
            {(row.fullName || row.name || '?').charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{row.fullName || row.name}</span>
            <span className="text-xs text-slate-400 font-medium">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (row) => (
        <span
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest',
            row.role?.name === 'SUPER_ADMIN'
              ? 'bg-rose-50 text-rose-600'
              : row.role?.name === 'ORG_ADMIN'
                ? 'bg-indigo-50 text-indigo-600'
                : 'bg-slate-100 text-slate-600'
          )}
        >
          {row.role?.name || '-'}
        </span>
      ),
    },
    {
      header: 'Organization',
      cell: (row) => row.organization?.name || '-',
    },
    {
      header: 'Joined',
      cell: (row) => formatDate(row.createdAt, 'MMM dd, yyyy'),
    },
    {
      header: 'Status',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
           <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
           <span className="text-xs font-bold text-slate-600">Active</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" className="h-8" onClick={() => beginEdit(row)}>
            <Pencil className="h-4 w-4 text-slate-500" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => {
              if (globalThis.confirm(`Delete user "${row.fullName || row.email}"?`)) {
                deleteUser.mutate(row.id);
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
        <Card title={editingId ? 'Edit User' : 'Create User'}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full name"
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="e.g. Jane Doe"
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="name@company.com"
              />
              {!editingId && (
                <Input
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="At least 8 characters"
                />
              )}
              <Select
                label="Role"
                value={form.roleId}
                onChange={(e) => setForm((prev) => ({ ...prev, roleId: e.target.value }))}
                options={[
                  { label: 'Select role', value: '' },
                  ...roleOptions,
                ]}
              />
              <Select
                label="Organization"
                value={form.organizationId}
                onChange={(e) => setForm((prev) => ({ ...prev, organizationId: e.target.value }))}
                options={[
                  { label: 'Select organization', value: '' },
                  ...organizationOptions,
                ]}
                disabled={isOrgAdmin}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" isLoading={createUser.isPending || updateUser.isPending}>
                {editingId ? 'Update User' : 'Create User'}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <ListLayout
        title="Team Directory"
        subtitle="Manage identities, roles and organizational access for all system members."
        searchPlaceholder="Search by name, email or role..."
        onSearch={(v) => setParams((p) => ({ ...p, q: v, page: 0 }))}
        isLoading={isLoading}
        data={data?.content || []}
        pagination={data}
        onPageChange={(p) => setParams((old) => ({ ...old, page: p }))}
        actions={
          <Button className="gap-2" onClick={beginCreate}>
            <UserPlus className="h-4 w-4" /> Invite Member
          </Button>
        }
        columns={columns}
      />
    </div>
  );
}


