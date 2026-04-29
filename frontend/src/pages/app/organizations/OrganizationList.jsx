import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button } from '@/components/ui/BaseComponents';
import { Building2, Plus, ExternalLink, ShieldCheck } from 'lucide-react';

export default function OrganizationList() {
  const [params, setParams] = useState({ page: 0, size: 10, search: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['organizations', params],
    queryFn: async () => {
      const resp = await apiClient.get('/organizations/search', { params });
      return resp.data;
    },
  });

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
             <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Joined {new Date(row.createdAt).toLocaleDateString()}</span>
           </div>
        </div>
      )
    },
    {
      header: 'ID',
      accessor: 'id',
      className: 'font-mono text-[10px]'
    },
    {
      header: 'Active Users',
      accessor: 'userCount',
      className: 'font-semibold text-slate-700'
    },
    {
      header: 'Assets Managed',
      accessor: 'assetCount',
      className: 'font-semibold text-slate-700'
    },
    {
      header: 'Plan',
      cell: (row) => (
        <Badge status="PENDING" className="bg-slate-100 text-slate-600 border-slate-200">
           {row.plan || 'Standard'}
        </Badge>
      )
    },
     {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
           <Button variant="ghost" size="sm" className="h-8">
              <ExternalLink className="h-4 w-4 text-slate-400" />
           </Button>
           <Button variant="outline" size="sm" className="h-8 gap-1.5 border-slate-200">
              <ShieldCheck className="h-4 w-4 text-[#2563EB]" /> Verify
           </Button>
        </div>
      )
    }
  ];

  return (
    <ListLayout
      title="Managed Organizations"
      subtitle="System-level view of all registered business entities and their resource usage."
      searchPlaceholder="Search organizations by name or ID..."
      onSearch={(v) => setParams(p => ({ ...p, search: v, page: 0 }))}
      isLoading={isLoading}
      data={data?.content || []}
      pagination={data}
      onPageChange={(p) => setParams(old => ({ ...old, page: p }))}
      actions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Entity
        </Button>
      }
      columns={columns}
    />
  );
}
