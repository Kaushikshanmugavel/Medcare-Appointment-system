import React from 'react';
import Link from 'next/link';
import { Activity, User, ShieldCheck, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-7xl mx-auto w-full">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mb-10 md:mb-16 space-y-4 md:space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <Activity size={12} className="animate-pulse" />
            <span>Healthcare Administration Systems</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none">
            Modern Patient Care, <br className="hidden sm:block" />
            <span className="text-blue-600">Simplified.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-medium px-2">
            Book consultations in under a minute or monitor clinics from a single, responsive dashboard interface.
          </p>
        </div>

        {/* Portals Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl">
          {/* Patient Portal Card */}
          <Link
            href="/patient"
            className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between items-start text-left cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-50/40 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300" />
            
            <div className="space-y-4 sm:space-y-6 z-10">
              <span className="inline-block bg-blue-50 p-3 sm:p-4 rounded-xl text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <User size={24} className="stroke-[2.5] sm:w-[28px] sm:h-[28px]" />
              </span>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Patient Portal
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Browse specialist doctors, select dates, view available time slots, and schedule appointments instantly. No login required.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-blue-600 mt-6 sm:mt-8 group-hover:translate-x-2 transition-transform duration-300 z-10">
              <span>Book Appointment</span>
              <ArrowRight size={16} />
            </div>
          </Link>

          {/* Admin Portal Card */}
          <Link
            href="/admin/login"
            className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between items-start text-left cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300" />

            <div className="space-y-4 sm:space-y-6 z-10">
              <span className="inline-block bg-slate-100 p-3 sm:p-4 rounded-xl text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <ShieldCheck size={24} className="stroke-[2.5] sm:w-[28px] sm:h-[28px]" />
              </span>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                  Administrator Portal
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Verify secret authorization keys, manage doctor profiles, update working hours, and review real-time booking logs.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-800 mt-6 sm:mt-8 group-hover:translate-x-2 transition-transform duration-300 z-10">
              <span>Manage Clinic</span>
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </main>

      <footer className="py-8 border-t border-slate-100 bg-white text-center text-xs font-semibold text-slate-400">
        &copy; {new Date().getFullYear()} MedCare Systems Inc. All rights reserved.
      </footer>
    </div>
  );
}
