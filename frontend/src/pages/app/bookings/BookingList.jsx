import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button } from '@/components/ui/BaseComponents';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, XCircle, Info, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingList() {
  const [params, setParams] = useState({ page: 0, size: 10, search: '', status: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', params],
    queryFn: async () => {
      const resp = await apiClient.get('/bookings/search', { params });
      return resp.data;
    },
  });

  const columns = [
    {
      header: 'Asset',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.assetName}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.assetId}</span>
        </div>
      )
    },
    {
      header: 'Reserved By',
      cell: (row) => (
        <div className="flex items-center gap-2">
           <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
             {row.userName?.charAt(0)}
           </div>
           <span className="font-medium text-slate-700">{row.userName}</span>
        </div>
      )
    },
    {
      header: 'Start Date',
      cell: (row) => formatDate(row.startDate)
    },
    {
      header: 'End Date',
      cell: (row) => formatDate(row.endDate)
    },
    {
      header: 'Status',
      cell: (row) => <Badge status={row.status}>{row.status}</Badge>
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
           {row.status === 'PENDING' && (
             <>
               <Button variant="secondary" size="sm" className="h-8 text-rose-600 hover:bg-rose-50 border-rose-100">
                 <XCircle className="h-4 w-4" />
               </Button>
               <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 border-none">
                 <CheckCircle2 className="h-4 w-4" />
               </Button>
             </>
           )}
           <Button variant="ghost" size="sm" className="h-8">
              <Info className="h-4 w-4 text-slate-400" />
           </Button>
        </div>
      )
    }
  ];

  return (
    <ListLayout
      title="Booking Requests"
      subtitle="Approve or manage organizational asset reservations and scheduling."
      searchPlaceholder="Search by user or asset..."
      onSearch={(v) => setParams(p => ({ ...p, search: v, page: 0 }))}
      isLoading={isLoading}
      data={data?.content || []}
      pagination={data}
      onPageChange={(p) => setParams(old => ({ ...old, page: p }))}
      columns={columns}
    />
  );
}
