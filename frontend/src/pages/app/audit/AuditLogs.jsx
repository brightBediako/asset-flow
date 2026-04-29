import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button, Card } from '@/components/ui/BaseComponents';
import { formatDate } from '@/lib/utils';
import { Terminal, Shield, LogIn, Database } from 'lucide-react';

export default function AuditLogs() {
  const [params, setParams] = useState({ page: 0, size: 20, search: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      const resp = await apiClient.get('/audit-logs', { params });
      return resp.data;
    },
  });

  const getActionIcon = (action) => {
    if (action.includes('LOGIN')) return <LogIn className="h-4 w-4 text-emerald-500" />;
    if (action.includes('DELETE')) return <Shield className="h-4 w-4 text-rose-500" />;
    return <Database className="h-4 w-4 text-blue-500" />;
  };

  const columns = [
    {
      header: 'Action',
      cell: (row) => (
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700">
           {getActionIcon(row.action)}
           {row.action}
        </div>
      )
    },
    {
      header: 'Entity / Target',
      cell: (row) => <span className="text-slate-500 font-medium">[{row.entityType}] {row.entityId}</span>
    },
    {
      header: 'Performed By',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.userName}</span>
          <span className="text-[10px] text-slate-400">{row.userIp || 'Internal System'}</span>
        </div>
      )
    },
    {
      header: 'Timestamp',
      cell: (row) => <span className="text-slate-400 font-mono">{formatDate(row.timestamp)}</span>
    },
    {
      header: 'Metadata',
      cell: (row) => (
        <div className="max-w-xs truncate text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">
           {row.metadata || '{}'}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
       <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-center gap-6 overflow-hidden relative">
          <div className="relative z-10 flex-1">
             <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Terminal className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-widest">System Audit Terminal</span>
             </div>
             <h2 className="text-2xl font-black tracking-tight">Immutability Protocol</h2>
             <p className="text-slate-400 mt-1 max-w-xl text-sm">Critical security ledger. Every interaction with the platform infrastructure is cryptographically logged and non-repudiable.</p>
          </div>
          <Shield className="h-32 w-32 text-indigo-500/10 absolute -right-4 -bottom-4 rotate-12" />
       </div>

       <ListLayout
         isLoading={isLoading}
         data={data?.content || []}
         pagination={data}
         onPageChange={(p) => setParams(old => ({ ...old, page: p }))}
         columns={columns}
         emptyMessage="System clean. No security events recorded."
       />
    </div>
  );
}
