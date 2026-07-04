import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 text-blue-600 font-bold text-xl group">
            <span className="bg-blue-50 p-2 rounded-lg text-blue-600 transition-colors group-hover:bg-blue-100">
              <Activity size={20} className="stroke-[2.5]" />
            </span>
            <span className="tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Med<span className="text-blue-600 font-medium">Care</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center space-x-6">
            <Link 
              href="/patient" 
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              Find Doctors
            </Link>
            
            <Link 
              href="/admin/login" 
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-all bg-white shadow-2xs"
            >
              <ShieldCheck size={14} />
              <span>Admin Portal</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
