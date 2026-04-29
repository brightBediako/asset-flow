import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button, Select } from '@/components/ui/BaseComponents';
import { formatDate } from '@/lib/utils';
import { ASSET_STATUS } from '@/constants/enums';
import { Plus, Wrench, CalendarPlus, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AssetList() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState({ page: 0, size: 10, search: '', status: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['assets', params],
    queryFn: async () => {
      const resp = await apiClient.get('/assets/search', { params });
      return resp.data;
    },
  });

  const columns = [
    {
      header: 'Asset Details',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.name}</span>
          <span className="text-xs text-slate-400 uppercase tracking-tighter mt-0.5">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (row) => <Badge status={row.status}>{row.status}</Badge>
    },
    {
       header: 'Serial / Tag',
       accessor: 'serialNumber',
       className: 'font-mono text-xs'
    },
    {
      header: 'Location',
      accessor: 'location'
    },
    {
      header: 'Last Maintenance',
      cell: (row) => formatDate(row.lastMaintenanceDate, 'MMM dd, yyyy')
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="sm" title="Edit Settings">
              <Settings2 className="h-4 w-4" />
           </Button>
           <Button variant="outline" size="sm" className="gap-1.5 h-8">
              <Plus className="h-3 w-3" /> Booking
           </Button>
        </div>
      )
    }
  ];

  return (
    <ListLayout
      title="Asset Inventory"
      subtitle="Comprehensive list of all organizational resources and their current states."
      searchPlaceholder="Search by name, serial or SKU..."
      onSearch={(v) => setParams(p => ({ ...p, search: v, page: 0 }))}
      isLoading={isLoading}
      data={data?.content || []}
      pagination={data}
      onPageChange={(p) => setParams(old => ({ ...old, page: p }))}
      actions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Asset
        </Button>
      }
      filters={
        <Select 
          className="w-40"
          value={params.status}
          onChange={(e) => setParams(p => ({ ...p, status: e.target.value, page: 0 }))}
          options={[
            { label: 'All Statuses', value: '' },
            ...Object.values(ASSET_STATUS).map(s => ({ label: s, value: s }))
          ]}
        />
      }
      columns={columns}
    />
  );
}
