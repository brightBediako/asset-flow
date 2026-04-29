import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Box, 
  CalendarClock, 
  History, 
  Wrench,
  UserCircle,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/BaseComponents';
import { cn } from '@/lib/utils';
import { ROLES } from '@/constants/enums';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/app', 
      icon: LayoutDashboard, 
      roles: [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN] 
    },
    { 
      name: 'Organizations', 
      href: '/app/organizations', 
      icon: Building2, 
      roles: [ROLES.SUPER_ADMIN] 
    },
    { 
      name: 'Users', 
      href: '/app/users', 
      icon: Users, 
      roles: [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN] 
    },
    { 
      name: 'Assets', 
      href: '/app/assets', 
      icon: Box, 
      roles: [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN] 
    },
    { 
      name: 'Bookings', 
      href: '/app/all-bookings', 
      icon: CalendarClock, 
      roles: [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN] 
    },
    { 
      name: 'Maintenance', 
      href: '/app/maintenance', 
      icon: Wrench, 
      roles: [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN] 
    },
    { 
      name: 'Audit Logs', 
      href: '/app/audit-logs', 
      icon: History, 
      roles: [ROLES.SUPER_ADMIN] 
    },
    { 
      name: 'My Bookings', 
      href: '/app/my-bookings', 
      icon: CalendarClock, 
      roles: [ROLES.USER] 
    },
    { 
      name: 'Profile', 
      href: '/app/profile', 
      icon: UserCircle, 
      roles: [ROLES.USER, ROLES.ORG_ADMIN, ROLES.SUPER_ADMIN] 
    },
  ].filter(item => item.roles.includes(user.role));

  const isActive = (path) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FA]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col fixed inset-y-0 z-40 bg-[#1E293B] border-r border-slate-800">
        <div className="flex items-center gap-3 px-8 h-16 border-b border-slate-800">
          <div className="bg-[#2563EB] p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
            <Box className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">AssetFlow</span>
        </div>

        <nav className="flex-1 overflow-y-auto pt-6 space-y-0">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 px-8 py-3.5 text-[13px] font-bold transition-all duration-200 border-l-4",
                isActive(item.href)
                  ? "bg-white/5 text-white border-[#2563EB]"
                  : "text-[#94A3B8] border-transparent hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 transition-colors",
                isActive(item.href) ? "text-[#2563EB]" : "text-[#94A3B8] group-hover:text-white"
              )} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 group transition-colors">
            <div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-[#94A3B8] font-bold uppercase truncate">{user.role}</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        "lg:ml-60"
      )}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shadow-sm">
/50">
          <div className="flex items-center gap-4 lg:hidden">
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
             >
                <Menu className="h-6 w-6" />
             </button>
             <span className="font-bold text-slate-900">AssetFlow</span>
          </div>

          <div className="hidden lg:block">
             <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
                {navigation.find(n => isActive(n.href))?.name || 'Overview'}
             </h2>
          </div>

          <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors">
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                      <p className="text-sm font-bold text-[#0F172A] leading-none">{user.name}</p>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">{user.organization?.name || 'Independent'}</p>
                  </div>
                  <Link to="/app/profile">
                    <div className="h-9 w-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
              </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white flex flex-col animate-in slide-in-from-left duration-300 shadow-2xl">
              <div className="flex items-center justify-between px-6 h-20 border-b border-slate-100">
                  <span className="text-xl font-bold text-slate-900">AssetFlow</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-900">
                      <X className="h-6 w-6" />
                  </button>
              </div>
              <nav className="flex-1 px-4 py-8 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl",
                        isActive(item.href) ? "bg-indigo-50 text-indigo-700" : "text-slate-600"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
              </nav>
              <div className="p-6 border-t border-slate-100">
                 <Button onClick={logout} variant="outline" className="w-full gap-2">
                    <LogOut className="h-4 w-4" /> Sign out
                 </Button>
              </div>
          </aside>
        </div>
      )}
    </div>
  );
}
