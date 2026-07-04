'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-blue-600 font-bold text-lg sm:text-xl group shrink-0">
            <span className="bg-blue-50 p-2 rounded-lg text-blue-600 transition-colors group-hover:bg-blue-100 shrink-0">
              <Activity size={18} className="stroke-[2.5]" />
            </span>
            <span className="tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap">
              Med<span className="text-blue-600 font-medium">Care</span>
            </span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center space-x-6">
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

          {/* Hamburger Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1.5"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Links Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white px-4 py-3 space-y-3 shadow-sm">
          <Link 
            href="/patient" 
            onClick={() => setIsOpen(false)}
            className="block text-sm font-semibold text-slate-600 hover:text-blue-600 py-1 transition-colors"
          >
            Find Doctors
          </Link>
          <Link 
            href="/admin/login" 
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-all bg-white shadow-2xs w-full justify-center"
          >
            <ShieldCheck size={14} />
            <span>Admin Portal</span>
          </Link>
        </div>
      )}
    </header>
  );
}

