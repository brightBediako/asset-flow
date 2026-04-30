import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import ListLayout from '@/components/common/ListLayout';
import { Badge, Button } from '@/components/ui/BaseComponents';
import { formatDate } from '@/lib/utils';
import { CalendarX, Clock, History } from 'lucide-react';

export default function MyBookings() {
  const [params, setParams] = useState({ page: 0, size: 10, search: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings', params],
    queryFn: async () => {
      // Backend scopes non-admin users to their own bookings.
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
          <span className="text-[10px] text-slate-400 font-mono italic">#{row.assetId}</span>
        </div>
      )
    },
    {
      header: 'Reserved Period',
      cell: (row) => (
        <div className="text-sm">
           <div className="flex items-center gap-1.5 text-slate-600">
             <Clock className="h-3 w-3" /> {formatDate(row.startDate)}
           </div>
           <div className="flex items-center gap-1.5 text-slate-400 mt-1">
             <div className="w-3 h-0.5 bg-slate-200 ml-1.5"></div>
             {formatDate(row.endDate)}
           </div>
        </div>
      )
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
           {(row.status === 'PENDING' || row.status === 'APPROVED') && (
             <Button variant="outline" size="sm" className="h-8 text-rose-600 hover:bg-rose-50 border-rose-100 gap-1.5">
               <CalendarX className="h-4 w-4" /> Cancel
             </Button>
           )}
           <Button variant="ghost" size="sm" className="h-8">
              <History className="h-4 w-4 text-slate-400" />
           </Button>
        </div>
      )
    }
  ];

  return (
    <ListLayout
      title="My Reservations"
      subtitle="Track and manage assets you have booked or currently possess."
      searchPlaceholder="Search your bookings..."
      onSearch={(v) => setParams(p => ({ ...p, search: v, page: 0 }))}
      isLoading={isLoading}
      data={data?.content || []}
      pagination={data}
      onPageChange={(p) => setParams(old => ({ ...old, page: p }))}
      columns={columns}
      emptyMessage="You haven't made any bookings yet."
    />
  );
}
