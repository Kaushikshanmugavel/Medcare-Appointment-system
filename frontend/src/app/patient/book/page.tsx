'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import { useDoctor } from '@/hooks/useDoctors';
import { useBookAppointment } from '@/hooks/useAppointments';
import { bookingSchema, BookingFormValues } from '@/validators';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Calendar, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const doctorId = searchParams.get('doctorId') || '';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';

  const { data: doctor, isLoading: isLoadingDoctor } = useDoctor(doctorId);
  const { mutate: bookSlot, isPending, error: bookingError } = useBookAppointment();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      appointmentDate: date,
      appointmentTime: time,
      patientName: '',
      age: undefined,
      problemDescription: '',
    },
  });

  // Keep form values in sync with search params
  useEffect(() => {
    if (date) setValue('appointmentDate', date);
    if (time) setValue('appointmentTime', time);
  }, [date, time, setValue]);

  if (!doctorId || !date || !time) {
    return (
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-16">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-lg font-bold text-slate-900">Missing slot parameters</h2>
        <p className="text-sm text-slate-500 mt-2">
          Please choose a doctor and select an available slot first.
        </p>
        <Link href="/patient" className="mt-6">
          <Button variant="primary">Browse Doctors</Button>
        </Link>
      </main>
    );
  }

  const onSubmit = (values: BookingFormValues) => {
    const payload = {
      ...values,
      doctorId,
    };
    
    bookSlot(payload, {
      onSuccess: (response) => {
        router.push(`/patient/confirm/${response.data._id}`);
      },
    });
  };

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <Link href="/patient" className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-800 mb-6 font-semibold transition-colors">
        <ArrowLeft size={16} />
        <span>Change Doctor or Time</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Column */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Booking Summary</h2>
          
          {isLoadingDoctor ? (
            <div className="bg-white border rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded-md w-3/4" />
              <div className="h-3 bg-slate-200 rounded-md w-1/2" />
              <div className="h-3 bg-slate-200 rounded-md w-5/6" />
            </div>
          ) : doctor ? (
            <Card className="bg-blue-600 border-none text-blue-50 shadow-md">
              <CardContent className="p-6 space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold text-blue-200 tracking-wider">Consultant</span>
                  <h3 className="text-lg font-bold text-white mt-1 leading-tight">{doctor.name}</h3>
                  <p className="text-xs font-semibold bg-blue-500 text-blue-50 rounded-full inline-block px-2.5 py-0.5 mt-2">
                    {doctor.specialization}
                  </p>
                </div>

                <div className="border-t border-blue-500 pt-6 space-y-3.5 text-xs font-semibold">
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-blue-200" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-blue-200" />
                    <span>{time} ({doctor.timezone})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Patient Information</h2>
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {bookingError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-3 text-red-700 text-xs font-semibold">
                    <AlertCircle className="shrink-0 mt-0.5" size={16} />
                    <span>{(bookingError as any).message || 'Failed to book slot. Check constraints.'}</span>
                  </div>
                )}

                {/* Name field */}
                <Input
                  label="Patient Name"
                  placeholder="Enter your full name"
                  error={errors.patientName?.message}
                  {...register('patientName')}
                />

                {/* Age field */}
                <Input
                  label="Patient Age"
                  type="number"
                  placeholder="Enter your age"
                  error={errors.age?.message}
                  {...register('age')}
                />

                {/* Symptoms field */}
                <TextArea
                  label="Problem Description"
                  placeholder="Describe your health concerns, symptoms or medical history briefly..."
                  error={errors.problemDescription?.message}
                  {...register('problemDescription')}
                />

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3 text-sm font-bold shadow-md"
                    isLoading={isPending}
                  >
                    Confirm and Book Appointment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function BookAppointmentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading booking parameters...</p>
          </div>
        </div>
      }>
        <BookingFormContent />
      </Suspense>
    </div>
  );
}
