import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Input } from '@/components/ui/BaseComponents';
import { User, Mail, Shield, Building, Save, Camera } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Profile</h1>
         <Button className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <Card className="md:col-span-1 text-center py-10 px-6">
            <div className="relative inline-block group">
               <div className="h-32 w-32 rounded-3xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-black border-4 border-white shadow-xl">
                  {user.name.charAt(0).toUpperCase()}
               </div>
               <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-lg text-slate-600 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                  <Camera className="h-5 w-5" />
               </button>
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900">{user.name}</h3>
            <p className="text-slate-500 text-sm font-medium">{user.role}</p>
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2">
               <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Storage Usage</span>
                  <span className="text-indigo-600 font-bold">42%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[42%] bg-indigo-600 rounded-full"></div>
               </div>
            </div>
         </Card>

         <div className="md:col-span-2 space-y-6">
            <Card title="Personal Information" subtitle="Update your contact details and identity">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Full Name" defaultValue={user.name} />
                  <Input label="Email Address" defaultValue={user.email} disabled />
                  <Input label="Job Title" placeholder="Operations Manager" />
                  <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
               </div>
            </Card>

            <Card title="Organization Detail" subtitle="Your current professional scope">
               <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden group">
                  <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm relative z-10 transition-transform group-hover:scale-110">
                     <Building className="h-7 w-7" />
                  </div>
                  <div className="relative z-10">
                     <h4 className="font-bold text-slate-900 text-lg">{user.organization?.name || 'Independent Agent'}</h4>
                     <p className="text-xs text-slate-500 font-medium">Member ID: {user.organizationId || 'SEC-0000'}</p>
                  </div>
                  <Shield className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-200/50" />
               </div>
            </Card>
         </div>
      </div>
   </div>
  );
}
