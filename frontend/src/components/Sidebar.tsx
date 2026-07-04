'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  LogOut 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Doctors',
      href: '/admin/dashboard/doctors',
      icon: Users,
    },
    {
      name: 'Appointments',
      href: '/admin/dashboard/appointments',
      icon: CalendarCheck,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('medcare_admin_secret_key');
    router.replace('/');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col h-screen fixed top-0 left-0 z-30 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 px-6 h-16 border-b border-slate-800 shrink-0">
        <span className="bg-blue-600/10 p-2 rounded-lg text-blue-400">
          <Activity size={20} className="stroke-[2.5]" />
        </span>
        <span className="font-bold text-lg text-white tracking-tight">
          Med<span className="text-blue-500 font-medium">Care</span> <span className="text-[10px] uppercase text-slate-500 font-bold bg-slate-800 px-1.5 py-0.5 rounded ml-1">Admin</span>
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Action Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 cursor-pointer"
        >
          <LogOut size={18} className="text-slate-500 group-hover:text-red-400" />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
}
