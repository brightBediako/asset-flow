import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Card } from '@/components/ui/BaseComponents';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password too short').required('Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/app';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Role-aware initial redirect if no explicit redirect param
      if (!searchParams.get('redirect')) {
        if (user.role === 'USER') {
          navigate('/app/profile');
        } else {
          navigate('/app');
        }
      } else {
        navigate(redirect);
      }
    } catch (error) {
      // Errors handled by axios interceptor
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="bg-[#2563EB] p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/20">
              <Box className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase italic">AssetFlow</span><p> | System Login</p>
          </Link>
          {/* <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">System Login</h2> */}
          <p className="mt-2 text-[13px] font-medium text-[#64748B] uppercase tracking-widest">Enterprise Asset Management</p>
        </div>

        <Card className="shadow-[0_20px_50px_rgba(37,99,235,0.05)] border-t-[6px] border-t-[#2563EB] p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. user@gmail.com"
              className="uppercase-label"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]" />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-[#64748B] uppercase tracking-wider">Keep Logged In</label>
              </div>
              <div className="text-xs">
                <a href="#" className="font-bold text-[#2563EB] hover:text-blue-700 uppercase tracking-wider">Forgot Password?</a>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-sm uppercase tracking-widest font-black" isLoading={isSubmitting}>
              Login
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs font-bold text-[#64748B] uppercase tracking-widest">
          New to the floor?{' '}
          <Link to="/register" className="text-[#2563EB] hover:text-blue-700 underline underline-offset-4">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
