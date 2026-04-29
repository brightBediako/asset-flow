import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button } from '@/components/ui/BaseComponents';
import { cn, formatDate } from '@/lib/utils';
import { UserPlus, Mail, ShieldCheck, ExternalLink } from 'lucide-react';

export default function UserList() {
  const [params, setParams] = useState({ page: 0, size: 10, search: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const resp = await apiClient.get('/users/search', { params });
      return resp.data;
    },
  });

  const columns = [
    {
      header: 'User identity',
      cell: (row) => (
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 flex-shrink-0 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
             {row.name?.charAt(0)}
           </div>
           <div className="flex flex-col">
             <span className="font-bold text-slate-900">{row.name}</span>
             <span className="text-xs text-slate-400 font-medium">{row.email}</span>
           </div>
        </div>
      )
    },
    {
      header: 'Role',
      cell: (row) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
          row.role === 'SUPER_ADMIN' ? "bg-rose-50 text-rose-600" :
          row.role === 'ORG_ADMIN' ? "bg-indigo-50 text-indigo-600" :
          "bg-slate-100 text-slate-600"
        )}>
           {row.role}
        </span>
      )
    },
    {
      header: 'Organization',
      accessor: 'organizationName'
    },
    {
      header: 'Joined',
      cell: (row) => formatDate(row.createdAt, 'MMM dd, yyyy')
    },
    {
      header: 'Status',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
           <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
           <span className="text-xs font-bold text-slate-600">Active</span>
        </div>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
           <Button variant="ghost" size="sm" className="h-8">
              <Mail className="h-4 w-4 text-slate-400" />
           </Button>
           <Button variant="outline" size="sm" className="h-8 gap-1.5 opacity-0 group-hover:opacity-100">
              <ExternalLink className="h-4 w-4" /> Details
           </Button>
        </div>
      )
    }
  ];

  return (
    <ListLayout
      title="Team Directory"
      subtitle="Manage identities, roles and organizational access for all system members."
      searchPlaceholder="Search by name, email or role..."
      onSearch={(v) => setParams(p => ({ ...p, search: v, page: 0 }))}
      isLoading={isLoading}
      data={data?.content || []}
      pagination={data}
      onPageChange={(p) => setParams(old => ({ ...old, page: p }))}
      actions={
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" /> Invite Member
        </Button>
      }
      columns={columns}
    />
  );
}


