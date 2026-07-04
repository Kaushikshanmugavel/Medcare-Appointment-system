'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema, AdminLoginFormValues } from '@/validators';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { ShieldAlert, Key, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // POST secret key to verify
      const response: any = await api.post('/admin/login', {
        secretKey: values.secretKey,
      });

      if (response.success && response.data.verified) {
        localStorage.setItem('medcare_admin_secret_key', values.secretKey);
        router.replace('/admin/dashboard');
      } else {
        setErrorMsg('Invalid admin credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Key verification failed. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header branding */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-xs">
              <ShieldAlert size={24} className="stroke-[2.5] sm:w-[28px] sm:h-[28px]" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Admin Authentication</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Please insert the secret key to enter the dashboard portal.
            </p>
          </div>

          <Card className="shadow-lg border-slate-100">
            <CardContent className="p-5 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-3 text-red-700 text-xs font-semibold">
                    <AlertCircle className="shrink-0 mt-0.5" size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Secret Key Input */}
                <div className="relative">
                  <Input
                    label="Secret Key"
                    type="password"
                    placeholder="••••••••••••••••"
                    error={errors.secretKey?.message}
                    {...register('secretKey')}
                  />
                  <Key className="absolute right-3.5 top-10.5 text-slate-400" size={16} />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3 text-sm font-bold shadow-md"
                    isLoading={isLoading}
                  >
                    Authenticate Session
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
