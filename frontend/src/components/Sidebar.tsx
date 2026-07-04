'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
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
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside */}
      <aside 
        className={`fixed top-0 left-0 h-screen w-[75vw] sm:w-[80vw] md:w-64 bg-slate-900 text-slate-400 flex flex-col z-50 md:z-30 border-r border-slate-800 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="bg-blue-600/10 p-2 rounded-lg text-blue-400">
              <Activity size={20} className="stroke-[2.5]" />
            </span>
            <span className="font-bold text-lg text-white tracking-tight">
              Med<span className="text-blue-500 font-medium">Care</span> <span className="text-[10px] uppercase text-slate-500 font-bold bg-slate-800 px-1.5 py-0.5 rounded ml-1">Admin</span>
            </span>
          </div>

          {/* Close button inside sidebar for mobile */}
          {onClose && (
            <button 
              onClick={onClose} 
              className="md:hidden text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
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
                onClick={onClose}
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
            onClick={() => {
              if (onClose) onClose();
              handleLogout();
            }}
            className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 cursor-pointer"
          >
            <LogOut size={18} className="text-slate-500 group-hover:text-red-400" />
            <span>Exit Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}

