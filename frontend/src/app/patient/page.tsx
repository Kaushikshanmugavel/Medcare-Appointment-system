'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useDoctors } from '@/hooks/useDoctors';
import { useAvailableSlots } from '@/hooks/useAppointments';
import { GridSkeleton } from '@/components/ui/Skeletons';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Clock, 
  MapPin, 
  Calendar,
  AlertCircle 
} from 'lucide-react';
import { Doctor } from '@/types';

export default function PatientPortal() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const { data: doctors, isLoading, error } = useDoctors(searchTerm);

  // Fetch slots if doctor and date are selected
  const { data: slots, isLoading: isLoadingSlots } = useAvailableSlots(
    selectedDoctor?._id || '',
    selectedDate
  );

  const handleSelectSlot = (time: string) => {
    if (!selectedDoctor) return;
    router.push(
      `/patient/book?doctorId=${selectedDoctor._id}&date=${selectedDate}&time=${time}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Doctors</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Select a specialized consultant and schedule your consultation slot.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <GridSkeleton count={6} />
        ) : error ? (
          <div className="text-center py-16 bg-white border rounded-2xl p-8 max-w-lg mx-auto">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-lg font-bold text-slate-900">Failed to load doctors</h2>
            <p className="text-sm text-slate-500 mt-2">
              There was a connection issue. Please check your backend is running.
            </p>
          </div>
        ) : doctors?.length === 0 ? (
          <div className="text-center py-16 bg-white border rounded-2xl p-8 max-w-lg mx-auto">
            <Search className="mx-auto text-slate-300 mb-4" size={48} />
            <h2 className="text-lg font-bold text-slate-900">No doctors found</h2>
            <p className="text-sm text-slate-500 mt-2">
              Try adjusting your search criteria or specializations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors
              ?.filter((doc) => doc.status === 'active')
              .map((doctor) => (
                <Card key={doctor._id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight">{doctor.name}</h3>
                        <span className="inline-block mt-1.5 px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full">
                          {doctor.specialization}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs font-semibold text-slate-500 mt-6">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-slate-400" />
                        <span>
                          Hours: {doctor.availableStartTime} - {doctor.availableEndTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} className="text-slate-400" />
                        <span>Zone: {doctor.timezone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Calendar size={14} className="text-slate-400 mt-0.5" />
                        <span>
                          Days: {doctor.workingDays.join(', ')}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-slate-50/50">
                    <Button
                      variant="outline"
                      className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 font-bold"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      Check Availability
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        )}
      </main>

      {/* Date & Slot selection dialog */}
      <Dialog
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        title={`Select Appointment Slot - ${selectedDoctor?.name}`}
      >
        <div className="space-y-6">
          {/* Select Date */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Appointment Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Available 30-Minute Slots ({selectedDoctor?.timezone})
            </label>
            
            {isLoadingSlots ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-9 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : slots?.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 border border-slate-100 rounded-xl">
                <AlertCircle className="mx-auto text-slate-400 mb-2" size={24} />
                <p className="text-xs text-slate-500 font-semibold">
                  No slots available on this date. Doctor may not be working.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slots?.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => handleSelectSlot(slot.time)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all border text-center truncate ${
                      slot.available
                        ? 'border-blue-100 hover:border-blue-500 bg-white text-slate-700 hover:bg-blue-50 cursor-pointer shadow-2xs'
                        : 'border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                    }`}
                    title={slot.time}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
