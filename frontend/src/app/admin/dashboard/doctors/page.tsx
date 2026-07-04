'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  useDoctors, 
  useCreateDoctor, 
  useUpdateDoctor, 
  useDeleteDoctor 
} from '@/hooks/useDoctors';
import { doctorSchema, DoctorFormValues } from '@/validators';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Search, Edit2, Trash2, Clock, CalendarDays } from 'lucide-react';
import { Doctor } from '@/types';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const { data: doctors, isLoading } = useDoctors(searchTerm);
  const { mutate: createDoc, isPending: isCreating } = useCreateDoctor();
  const { mutate: updateDoc, isPending: isUpdating } = useUpdateDoctor(editingDoctor?._id || '');
  const { mutate: deleteDoc } = useDeleteDoctor();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: '',
      specialization: '',
      availableStartTime: '09:00',
      availableEndTime: '17:00',
      timezone: 'UTC',
      status: 'active',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
  });

  const selectedDays = watch('workingDays') || [];

  const handleOpenCreateModal = () => {
    setEditingDoctor(null);
    reset({
      name: '',
      specialization: '',
      availableStartTime: '09:00',
      availableEndTime: '17:00',
      timezone: 'UTC',
      status: 'active',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    reset({
      name: doctor.name,
      specialization: doctor.specialization,
      availableStartTime: doctor.availableStartTime,
      availableEndTime: doctor.availableEndTime,
      timezone: doctor.timezone,
      status: doctor.status,
      workingDays: doctor.workingDays,
    });
    setIsModalOpen(true);
  };

  const handleToggleDay = (day: string) => {
    const current = [...selectedDays];
    const index = current.indexOf(day);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(day);
    }
    setValue('workingDays', current, { shouldValidate: true });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this doctor profile?')) {
      deleteDoc(id);
    }
  };

  const onSubmit = (values: DoctorFormValues) => {
    if (editingDoctor) {
      updateDoc(values, {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        },
      });
    } else {
      createDoc(values, {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        },
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Doctors Registry</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Add, update, or remove active medical consultants and working calendars.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 font-bold shrink-0 self-start sm:self-center shadow-md w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>Register Doctor</span>
        </Button>
      </div>

      {/* Filter and search bars */}
      <div className="flex bg-white p-4 border border-slate-100 rounded-xl shadow-2xs">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Grid listing */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : !doctors || doctors.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl p-8 max-w-lg mx-auto">
          <Search className="mx-auto text-slate-300 mb-4" size={48} />
          <h2 className="text-lg font-bold text-slate-900">No doctors registered</h2>
          <p className="text-sm text-slate-500 mt-2">
            Click the "Register Doctor" button above to register your first doctor.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Specialization</th>
                  <th className="px-6 py-4">Working Schedule</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4.5 font-bold text-slate-900">{doctor.name}</td>
                    <td className="px-6 py-4.5">
                      <span className="px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                        {doctor.specialization}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 space-y-1">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500">
                        <Clock size={13} className="text-slate-400" />
                        <span>
                          {doctor.availableStartTime} - {doctor.availableEndTime} ({doctor.timezone})
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500">
                        <CalendarDays size={13} className="text-slate-400" />
                        <span className="truncate max-w-[200px]" title={doctor.workingDays.join(', ')}>
                          {doctor.workingDays.join(', ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                          doctor.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(doctor)}
                        className="inline-flex p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit profile"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor._id)}
                        className="inline-flex p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete profile"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register/Edit Dialog Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? `Edit Doctor Details - ${editingDoctor.name}` : 'Register New Doctor'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Doctor Name"
            placeholder="e.g. Dr. Alex Mercer"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Specialization"
            placeholder="e.g. Cardiology"
            error={errors.specialization?.message}
            {...register('specialization')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Available Start"
              type="text"
              placeholder="09:00"
              error={errors.availableStartTime?.message}
              {...register('availableStartTime')}
            />
            <Input
              label="Available End"
              type="text"
              placeholder="17:00"
              error={errors.availableEndTime?.message}
              {...register('availableEndTime')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Timezone"
              placeholder="e.g. UTC, Asia/Kolkata"
              error={errors.timezone?.message}
              {...register('timezone')}
            />
            <Select
              label="Status"
              error={errors.status?.message}
              {...register('status')}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>

          {/* Working Days */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Working Weekdays
            </label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                );
              })}
            </div>
            {errors.workingDays && (
              <span className="block mt-1.5 text-xs text-red-500 font-medium">
                {errors.workingDays.message}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="font-bold"
              isLoading={isCreating || isUpdating}
            >
              {editingDoctor ? 'Save Changes' : 'Register Profile'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
