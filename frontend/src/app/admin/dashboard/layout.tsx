'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Menu, Activity } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const secretKey = localStorage.getItem('medcare_admin_secret_key');
    if (!secretKey) {
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <header className="flex md:hidden items-center justify-between px-4 h-16 bg-white border-b border-slate-100 sticky top-0 z-30 w-full shrink-0">
        <div className="flex items-center space-x-2.5 text-blue-600 font-bold text-lg">
          <span className="bg-blue-50 p-2 rounded-lg text-blue-600">
            <Activity size={18} className="stroke-[2.5]" />
          </span>
          <span className="tracking-tight text-slate-900">
            Med<span className="text-blue-600 font-medium">Care</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1.5 cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Admin Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 min-h-screen flex flex-col">
        <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

