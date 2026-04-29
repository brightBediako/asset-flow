import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button, Select } from '@/components/ui/BaseComponents';
import { formatDate } from '@/lib/utils';
import { Wrench, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MaintenanceList() {
  const [params, setParams] = useState({ page: 0, size: 10, search: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['maintenance', params],
    queryFn: async () => {
      const resp = await apiClient.get('/maintenance-records', { params });
      return resp.data;
    },
  });

  const columns = [
    {
      header: 'Asset / Type',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.assetName}</span>
          <span className="text-xs text-slate-400 font-medium">{row.maintenanceType}</span>
        </div>
      )
    },
    {
      header: 'Performed By',
      accessor: 'performedBy'
    },
    {
      header: 'Date',
      cell: (row) => formatDate(row.maintenanceDate, 'MMM dd, yyyy')
    },
    {
      header: 'Status',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {row.isCompleted ? (
            <Badge status="APPROVED">Completed</Badge>
          ) : (
            <Badge status="PENDING">In Progress</Badge>
          )}
        </div>
      )
    },
    {
      header: 'Cost',
      cell: (row) => (
        <span className="font-mono text-slate-600 font-semibold">
           ${row.cost?.toFixed(2) || '0.00'}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
           {!row.isCompleted && (
             <Button variant="outline" size="sm" className="h-8 gap-1.5 border-emerald-100 text-emerald-600 hover:bg-emerald-50">
               <CheckCircle2 className="h-4 w-4" /> Resolve
             </Button>
           )}
           <Button variant="ghost" size="sm" className="h-8">
              <AlertCircle className="h-4 w-4 text-slate-400" />
           </Button>
        </div>
      )
    }
  ];

  return (
    <ListLayout
      title="Maintenance Records"
      subtitle="History and scheduling for all asset repairs and inspections."
      searchPlaceholder="Search maintenance history..."
      onSearch={(v) => setParams(p => ({ ...p, search: v, page: 0 }))}
      isLoading={isLoading}
      data={data?.content || []}
      pagination={data}
      onPageChange={(p) => setParams(old => ({ ...old, page: p }))}
      actions={
        <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
          <Wrench className="h-4 w-4" /> Schedule Repair
        </Button>
      }
      columns={columns}
    />
  );
}
