import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/BaseComponents';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-rose-50 p-6 rounded-full mb-6">
        <ShieldAlert className="h-16 w-16 text-rose-600" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-4">Access Denied</h1>
      <p className="text-lg text-slate-600 max-w-md mb-8">
        Oops! You don't have the required permissions to view this section. If you think this is a mistake, please contact your administrator.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
        <Button onClick={() => navigate('/')} className="gap-2">
          <Home className="h-4 w-4" /> Go Home
        </Button>
      </div>
    </div>
  );
}
