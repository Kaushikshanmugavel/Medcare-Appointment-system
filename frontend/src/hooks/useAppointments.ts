import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Appointment, ApiResponse } from '@/types';
import { BookingFormValues } from '@/validators';

export function useAppointments(date?: string, doctorId?: string) {
  return useQuery<ApiResponse<Appointment[]>, Error, Appointment[]>({
    queryKey: ['appointments', date, doctorId],
    queryFn: () => api.get('/appointments', { params: { date, doctorId } }),
    select: (response) => response.data,
  });
}

export function useAppointment(id: string) {
  return useQuery<ApiResponse<Appointment>, Error, Appointment>({
    queryKey: ['appointment', id],
    queryFn: () => api.get(`/appointments/${id}`),
    enabled: !!id,
    select: (response) => response.data,
  });
}

export function useAvailableSlots(doctorId: string, date: string) {
  return useQuery<ApiResponse<{ time: string; available: boolean }[]>, Error, { time: string; available: boolean }[]>({
    queryKey: ['slots', doctorId, date],
    queryFn: () => api.get('/appointments/slots', { params: { doctorId, date } }),
    enabled: !!doctorId && !!date,
    select: (response) => response.data,
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Appointment>, Error, BookingFormValues>({
    mutationFn: (data) => api.post('/appointments', data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
  });
}

export function useAdminMetrics() {
  return useQuery<ApiResponse<{
    totalDoctors: number;
    availableDoctors: number;
    todayAppointments: number;
    totalAppointments: number;
  }>, Error, {
    totalDoctors: number;
    availableDoctors: number;
    todayAppointments: number;
    totalAppointments: number;
  }>({
    queryKey: ['admin-metrics'],
    queryFn: () => api.get('/admin/metrics'),
    select: (response) => response.data,
  });
}
