import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="text-center space-y-5 max-w-md bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
        <AlertCircle className="mx-auto text-blue-500" size={48} />
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404</h1>
          <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-slate-500 font-semibold leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" className="w-full font-bold">
              Go to Home Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
