'use client';

import React from 'react';
import { useAdminMetrics, useAppointments } from '@/hooks/useAppointments';
import { Card, CardContent } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { 
  Users, 
  Activity, 
  CalendarDays, 
  Layers, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: metrics, isLoading: isLoadingMetrics, error: metricsError } = useAdminMetrics();
  const { data: appointments, isLoading: isLoadingAppts } = useAppointments();

  // Metrics card configuration
  const statCards = [
    {
      title: 'Total Doctors',
      value: metrics?.totalDoctors ?? 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Available Doctors',
      value: metrics?.availableDoctors ?? 0,
      icon: Activity,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: "Today's Appointments",
      value: metrics?.todayAppointments ?? 0,
      icon: CalendarDays,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Total Bookings',
      value: metrics?.totalAppointments ?? 0,
      icon: Layers,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview Dashboard</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Monitor registrations, schedules, and active consultants at a glance.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      {isLoadingMetrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-xl p-6 h-28 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded-md w-1/2" />
              <div className="h-6 bg-slate-200 rounded-md w-1/3" />
            </div>
          ))}
        </div>
      ) : metricsError ? (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-700 text-xs font-semibold">
          <AlertCircle size={18} />
          <span>Failed to load admin metrics. Check connection or key authorization.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                    <p className="text-3xl font-extrabold text-slate-900 leading-none">{card.value}</p>
                  </div>
                  <span className={`p-3.5 rounded-xl ${card.color}`}>
                    <Icon size={22} className="stroke-[2.5]" />
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recent Appointments table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Bookings</h2>
          <Link href="/admin/dashboard/appointments" className="text-xs font-bold text-blue-600 hover:text-blue-700">
            View All Log
          </Link>
        </div>

        {isLoadingAppts ? (
          <TableSkeleton rows={5} cols={5} />
        ) : !appointments || appointments.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-xl p-12 text-center text-slate-400">
            <Clock size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-xs font-semibold">No appointments have been booked yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Schedule</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.slice(0, 5).map((appt) => {
                    const doc = typeof appt.doctorId === 'object' ? appt.doctorId : null;
                    return (
                      <tr key={appt._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4.5 font-bold text-slate-900">{appt.appointmentId}</td>
                        <td className="px-6 py-4.5">
                          <span className="font-semibold text-slate-800 block leading-tight">{appt.patientName}</span>
                          <span className="text-[11px] text-slate-400 font-semibold">{appt.age} yrs</span>
                        </td>
                        <td className="px-6 py-4.5">
                          <span className="font-semibold text-slate-800 block leading-tight">{doc?.name || 'N/A'}</span>
                          <span className="text-[11px] text-slate-400 font-semibold">{doc?.specialization || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4.5">
                          <span className="font-semibold text-slate-800 block leading-tight">{appt.appointmentDate}</span>
                          <span className="text-[11px] text-slate-400 font-semibold">{appt.appointmentTime}</span>
                        </td>
                        <td className="px-6 py-4.5">
                          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
