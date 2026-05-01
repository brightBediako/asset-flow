import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Card, Button, Input } from '@/components/ui/BaseComponents';
import { Shield, Building, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const ghanaPhonePattern = /^(?:\+233|0)\d{9}$/;
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    jobTitle: '',
    phoneNumber: '',
    organizationName: '',
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || user.name || '',
      email: user.email || '',
      jobTitle: user.jobTitle || '',
      phoneNumber: user.phoneNumber || '',
      organizationName: user.organization?.name || '',
    });
  }, [user]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('User context is not available');
      }

      const requests = [];

      requests.push(
        apiClient.put(`/users/${user.id}`, {
          fullName: form.fullName.trim(),
          email: form.email,
          role: user.roleId ? { id: user.roleId } : undefined,
          organization: user.organization?.id ? { id: user.organization.id } : undefined,
          jobTitle: form.jobTitle.trim(),
          phoneNumber: form.phoneNumber.trim() || null,
        })
      );

      if (user.organization?.id && form.organizationName.trim()) {
        requests.push(
          apiClient.put(`/organizations/${user.organization.id}`, {
            name: form.organizationName.trim(),
          })
        );
      }

      await Promise.all(requests);
    },
    onSuccess: async () => {
      await refreshUser();
      toast.success('Profile updated successfully');
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Profile</h1>
         <Button
           className="gap-2"
           isLoading={updateProfile.isPending}
           onClick={() => {
             if (!form.fullName.trim()) {
               toast.error('Full name is required');
               return;
             }
             const normalizedPhone = form.phoneNumber.trim().replaceAll(' ', '');
             if (normalizedPhone && !ghanaPhonePattern.test(normalizedPhone)) {
               toast.error('Use a valid Ghana phone number: 0XXXXXXXXX or +233XXXXXXXXX');
               return;
             }
             updateProfile.mutate();
           }}
         >
            <Save className="h-4 w-4" /> Save Changes
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <Card className="md:col-span-1 text-center py-10 px-6">
            <div className="relative inline-block group">
               <div className="h-32 w-32 rounded-3xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-black border-4 border-white shadow-xl">
                  {(form.fullName || user.name || '?').charAt(0).toUpperCase()}
               </div>
               <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-lg text-slate-600 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                  <Camera className="h-5 w-5" />
               </button>
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900">{form.fullName || user.name}</h3>
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
                  <Input
                    label="Full Name"
                    value={form.fullName}
                    onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  />
                  <Input label="Email Address" value={form.email} disabled />
                  <Input
                    label="Job Title"
                    value={form.jobTitle}
                    onChange={(e) => setForm((prev) => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="Operations Manager"
                  />
                  <Input
                    label="Phone Number"
                    value={form.phoneNumber}
                    onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+233241234567 or 0241234567"
                  />
               </div>
            </Card>

            <Card title="Organization Detail" subtitle="Your current professional scope">
               <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden group">
                  <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm relative z-10 transition-transform group-hover:scale-110">
                     <Building className="h-7 w-7" />
                  </div>
                  <div className="relative z-10">
                     <Input
                       label="Organization Name"
                       value={form.organizationName}
                       onChange={(e) => setForm((prev) => ({ ...prev, organizationName: e.target.value }))}
                       disabled={!user.organization?.id}
                     />
                     <p className="text-xs text-slate-500 font-medium mt-1">
                       Member ID: {user.organization?.id || 'SEC-0000'}
                     </p>
                  </div>
                  <Shield className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-200/50" />
               </div>
            </Card>
         </div>
      </div>
   </div>
  );
}
