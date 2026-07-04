'use client';

import React, { use } from 'react';
import Navbar from '@/components/Navbar';
import { useAppointment } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle, Calendar, Clock, User, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ConfirmPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingConfirmationPage({ params }: ConfirmPageProps) {
  const { id } = use(params);
  const { data: appointment, isLoading, error } = useAppointment(id);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex justify-center items-center">
          <div className="animate-pulse space-y-4 max-w-md w-full p-6 text-center">
            <div className="mx-auto bg-slate-200 h-16 w-16 rounded-full" />
            <div className="h-6 bg-slate-200 rounded-md w-3/4 mx-auto" />
            <div className="h-4 bg-slate-200 rounded-md w-1/2 mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col justify-center items-center px-4">
          <div className="text-center p-8 bg-white border rounded-2xl max-w-md">
            <h2 className="text-lg font-bold text-slate-900">Appointment not found</h2>
            <p className="text-sm text-slate-500 mt-2">
              The booking reference does not exist or you do not have permission to view it.
            </p>
            <Link href="/" className="mt-6 inline-block">
              <Button variant="primary">Return Home</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Doctor object is populated in backend
  const doctor = typeof appointment.doctorId === 'object' ? appointment.doctorId : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <div className="text-center mb-6 sm:mb-8 space-y-3">
          <div className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 p-3 sm:p-4 rounded-full shadow-xs">
            <CheckCircle size={32} className="stroke-[2.5] sm:w-[40px] sm:h-[40px]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Booking Confirmed!</h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Your appointment has been successfully registered in our systems.
          </p>
        </div>

        <Card className="border-emerald-100 shadow-md">
          <CardContent className="p-5 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400">Appointment ID</span>
                <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{appointment.appointmentId}</p>
              </div>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full uppercase tracking-wider">
                Active
              </span>
            </div>

            {/* Doctor Detail */}
            <div className="space-y-1.5">
              <span className="text-xs uppercase font-bold text-slate-400">Practitioner</span>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-none text-sm sm:text-base">{doctor?.name || 'Medical Specialist'}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{doctor?.specialization || 'Consultant'}</p>
                </div>
              </div>
            </div>

            {/* Schedule details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-100 py-5">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-slate-400 block">Date</span>
                <div className="flex items-center space-x-2 text-sm font-bold text-slate-700">
                  <Calendar size={15} className="text-slate-400" />
                  <span>{appointment.appointmentDate}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-slate-400 block">Time Slot</span>
                <div className="flex items-center space-x-2 text-sm font-bold text-slate-700">
                  <Clock size={15} className="text-slate-400" />
                  <span>{appointment.appointmentTime} ({doctor?.timezone || 'UTC'})</span>
                </div>
              </div>
            </div>

            {/* Patient details */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold text-slate-400">Patient Details</span>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-xs font-semibold text-slate-600">
                <div className="flex items-center space-x-2">
                  <User size={14} className="text-slate-400" />
                  <span>Name: {appointment.patientName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-flex items-center justify-center text-[8px] font-bold text-slate-400">A</span>
                  <span>Age: {appointment.age} yrs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Home Redirect */}
        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button variant="outline" className="inline-flex items-center space-x-2 font-bold">
              <span>Return to Main Portal</span>
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
