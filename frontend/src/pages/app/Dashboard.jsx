import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, Button } from '@/components/ui/BaseComponents';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { 
  Users, 
  Box, 
  CalendarCheck, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Wrench
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch summary stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [assetsResp, usersResp, bookingsResp, maintenanceResp] = await Promise.all([
        apiClient.get('/assets/search', { params: { page: 0, size: 1 } }),
        apiClient.get('/users/search', { params: { page: 0, size: 1 } }),
        apiClient.get('/bookings/search', { params: { page: 0, size: 200 } }),
        apiClient.get('/maintenance-records'),
      ]);

      const bookings = bookingsResp.data?.content || [];
      const activeBookings = bookings.filter((booking) =>
        ['APPROVED', 'PENDING', 'IN_PROGRESS'].includes(booking.status)
      ).length;
      const pendingMaintenance = (maintenanceResp.data || []).filter((record) =>
        ['PENDING', 'SCHEDULED', 'OPEN'].includes(record.status)
      ).length;

      return {
        totalAssets: assetsResp.data?.totalElements ?? 0,
        activeUsers: usersResp.data?.totalElements ?? 0,
        activeBookings,
        pendingMaintenance,
        recentActivity: [],
      };
    },
    retry: 0,
  });

  const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <Card className="relative overflow-hidden group border-none shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-black text-[#0F172A] mt-1 tracking-tight">{value || '0'}</h4>
          {trend && (
            <p className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center gap-1 uppercase tracking-tight">
              <TrendingUp className="h-3 w-3" /> {trend}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg transition-all duration-300 group-hover:scale-110 shadow-sm", colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-500 mt-1">Platform metrics for {user.organization?.name || 'All Organizations'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">Export Data</Button>
          <Button size="sm">Generate Report</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Assets" 
          value={stats?.totalAssets} 
          icon={Box} 
          trend="+12% from last month"
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          title="Active Users" 
          value={stats?.activeUsers} 
          icon={Users} 
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Current Bookings" 
          value={stats?.activeBookings} 
          icon={CalendarCheck} 
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Maintenance Requests" 
          value={stats?.pendingMaintenance} 
          icon={AlertTriangle} 
          colorClass="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Recent Asset Activity" subtitle="Real-time log of asset usage across the organization">
          <div className="relative overflow-x-auto">
             <table className="w-full text-[13px] text-left">
                <thead className="text-[10px] text-[#64748B] uppercase bg-slate-50 font-black tracking-widest border-y border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Asset</th>
                    <th className="px-6 py-3 text-center">User</th>
                    <th className="px-6 py-3 text-center">Action</th>
                    <th className="px-6 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentActivity?.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#0F172A]">{act.assetName}</td>
                      <td className="px-6 py-4 text-slate-600 text-center">{act.userName}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tight text-slate-600 border border-slate-200">
                          {act.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#64748B] text-right font-mono text-[10px] font-medium">{act.timestamp}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-400 italic">No recent activity found.</td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Frequently used administrative tasks">
           <div className="grid grid-cols-1 gap-2.5">
              <Button variant="outline" className="justify-start gap-3 h-11 border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/50">
                 <Box className="h-4 w-4 text-[#2563EB]" /> Add New Asset
              </Button>
              <Button variant="outline" className="justify-start gap-3 h-11 border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/50">
                 <Users className="h-4 w-4 text-[#2563EB]" /> Onboard User
              </Button>
              <Button variant="outline" className="justify-start gap-3 h-11 border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/50">
                 <Wrench className="h-4 w-4 text-[#2563EB]" /> Record Maintenance
              </Button>
              <Button variant="outline" className="justify-start gap-3 h-11 border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/50">
                 <CalendarCheck className="h-4 w-4 text-[#2563EB]" /> Review Bookings
              </Button>
           </div>
           <div className="mt-8 bg-[#2563EB] rounded-xl p-6 text-white overflow-hidden relative shadow-lg shadow-blue-500/20">
              <div className="relative z-10">
                <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2">Usage Insights</p>
                <h5 className="text-xl font-black mb-4 leading-tight tracking-tight">Utilization is up by 24% this week.</h5>
                <Button variant="secondary" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm border-none shadow-none">View Detailed Report</Button>
              </div>
              <Activity className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 rotate-12" />
           </div>
        </Card>
      </div>
    </div>
  );
}


