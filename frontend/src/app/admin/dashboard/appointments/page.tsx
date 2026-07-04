'use client';

import React, { useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { useDoctors } from '@/hooks/useDoctors';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { Card, CardContent } from '@/components/ui/Card';
import { Calendar, Users, AlertCircle, Clock, FileText } from 'lucide-react';

export default function AppointmentsLog() {
  const [filterDate, setFilterDate] = useState('');
  const [filterDocId, setFilterDocId] = useState('');

  const { data: doctors } = useDoctors();
  const { data: appointments, isLoading, error } = useAppointments(
    filterDate || undefined,
    filterDocId || undefined
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointments Ledger</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Review, filter, and track booked appointments across all registered specialists.
        </p>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 border border-slate-100 rounded-xl shadow-2xs">
        {/* Date Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Filter by Date</label>
          <div className="relative">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Doctor Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Filter by Doctor</label>
          <select
            value={filterDocId}
            onChange={(e) => setFilterDocId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Doctors</option>
            {doctors?.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>
        </div>

        {/* Reset Action */}
        {(filterDate || filterDocId) && (
          <div className="flex items-end pb-0.5">
            <button
              onClick={() => {
                setFilterDate('');
                setFilterDocId('');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-2.5 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Grid listing */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-700 text-xs font-semibold">
          <AlertCircle size={18} />
          <span>Failed to load appointments log. Please check your admin auth credentials.</span>
        </div>
      ) : !appointments || appointments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl p-8 max-w-lg mx-auto shadow-2xs">
          <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
          <h2 className="text-lg font-bold text-slate-900">No appointments found</h2>
          <p className="text-sm text-slate-500 mt-2">
            No booking matching your filters exists. Try altering your filters.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Ref ID</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Specialist</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Symptoms / Notes</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => {
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
                      <td className="px-6 py-4.5 space-y-0.5">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{appt.appointmentDate}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400">
                          <Clock size={13} className="text-slate-400" />
                          <span>{appt.appointmentTime} ({doc?.timezone || 'UTC'})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 max-w-[280px]">
                        <div className="flex items-start space-x-1.5">
                          <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-500 font-semibold line-clamp-2" title={appt.problemDescription}>
                            {appt.problemDescription}
                          </span>
                        </div>
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
  );
}
