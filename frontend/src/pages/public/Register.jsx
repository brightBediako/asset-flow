import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Box, User, Building2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Card } from '@/components/ui/BaseComponents';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  organizationName: yup.string().when('accountType', {
    is: 'ORGANIZATION',
    then: (schema) => schema.required('Organization name is required'),
  }),
});

export default function Register() {
  const [accountType, setAccountType] = useState('USER'); // 'USER' or 'ORGANIZATION'
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { accountType: 'USER' }
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({ ...data, accountType });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      // Handled by axios interceptor
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Box className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">AssetFlow</span>
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create your account</h2>
          <p className="mt-2 text-slate-500">Join thousands of organizations managing assets efficiently.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            type="button"
            onClick={() => setAccountType('USER')}
            className={cn(
              "relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group",
              accountType === 'USER' 
                ? "border-indigo-600 bg-white shadow-md ring-4 ring-indigo-50" 
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
              accountType === 'USER' ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
            )}>
              <User className="h-6 w-6" />
            </div>
            {accountType === 'USER' && <CheckCircle2 className="absolute top-4 right-4 h-6 w-6 text-indigo-600" />}
            <h3 className="font-bold text-slate-900 text-lg">Individual User</h3>
            <p className="text-sm text-slate-500 mt-1">Book assets and manage your personal organization assignments.</p>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('ORGANIZATION')}
            className={cn(
              "relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group",
              accountType === 'ORGANIZATION' 
                ? "border-indigo-600 bg-white shadow-md ring-4 ring-indigo-50" 
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
              accountType === 'ORGANIZATION' ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
            )}>
              <Building2 className="h-6 w-6" />
            </div>
            {accountType === 'ORGANIZATION' && <CheckCircle2 className="absolute top-4 right-4 h-6 w-6 text-indigo-600" />}
            <h3 className="font-bold text-slate-900 text-lg">Organization</h3>
            <p className="text-sm text-slate-500 mt-1">Manage multiple users, assets, and track departmental resources.</p>
          </button>
        </div>

        <Card className="shadow-xl bg-white p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.fullName?.message}
                {...register('fullName')}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {accountType === 'ORGANIZATION' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <Input
                  label="Organization Name"
                  placeholder="Acme Corp"
                  error={errors.organizationName?.message}
                  {...register('organizationName')}
                />
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-lg" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 underline decoration-indigo-200 underline-offset-4">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
