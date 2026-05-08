import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, ShieldCheck, Box, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/BaseComponents';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="bg-[#2563EB] p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Box className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black text-[#0F172A] tracking-tighter uppercase italic">AssetFlow</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/assets" className="text-xs font-black text-[#64748B] hover:text-[#2563EB] uppercase tracking-widest transition-colors">Browse</Link>
            {isAuthenticated ? (
              <Link to="/app">
                <Button size="sm" className="px-6 rounded-lg uppercase tracking-widest text-[11px] font-black">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs font-black text-[#64748B] hover:text-[#2563EB] uppercase tracking-widest transition-colors">Login</Link>
                <Link to="/register">
                  <Button size="sm" className="px-6 rounded-lg uppercase tracking-widest text-[11px] font-black">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#2563EB] ring-1 ring-inset ring-blue-500/10 mb-8">
                Operating at Global Scale
              </span>
              <h1 className="text-6xl font-black text-[#0F172A] sm:text-8xl leading-[0.9] tracking-tight">
                Enterprise <br />
                <span className="text-[#2563EB]">Assets.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-xl text-sm font-medium text-[#64748B] leading-relaxed uppercase tracking-widest">
                High-precision resource management for modern industrial and digital frameworks.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xs font-black uppercase tracking-[0.2em]">
                    Establish System Access <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/assets">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
                    Browse Public Assets
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-0 pointer-events-none opacity-40">
           <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl" />
           <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-100 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="relative p-10 rounded-2xl bg-[#F4F7FA] hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group border border-transparent hover:border-blue-100">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-10 text-[#2563EB] shadow-sm transform group-hover:-translate-y-2 transition-transform duration-500">
                <BarChart3 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-4 tracking-tight uppercase">Precision Analytics</h3>
              <p className="text-[13px] font-medium text-[#64748B] leading-relaxed uppercase tracking-widest">High-granularity data streams for asset lifecycle oversight and optimization.</p>
            </div>
            <div className="relative p-10 rounded-2xl bg-[#F4F7FA] hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group border border-transparent hover:border-blue-100">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-10 text-[#2563EB] shadow-sm transform group-hover:-translate-y-2 transition-transform duration-500">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-4 tracking-tight uppercase">Protocol Integrity</h3>
              <p className="text-[13px] font-medium text-[#64748B] leading-relaxed uppercase tracking-widest">Binary-level security parameters with immutable audit logs for every transaction.</p>
            </div>
            <div className="relative p-10 rounded-2xl bg-[#F4F7FA] hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group border border-transparent hover:border-blue-100">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-10 text-[#2563EB] shadow-sm transform group-hover:-translate-y-2 transition-transform duration-500">
                <CalendarDays className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-4 tracking-tight uppercase">Live Scheduling</h3>
              <p className="text-[13px] font-medium text-[#64748B] leading-relaxed uppercase tracking-widest">Real-time resource allocation with predictive availability and automated workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E293B] py-20 text-slate-400 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-[#2563EB] p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Box className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-black text-xl tracking-tighter uppercase italic">AssetFlow</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#64748B]">© 2026 AssetFlow Professional Terminal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
