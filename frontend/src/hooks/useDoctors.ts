import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Doctor, ApiResponse } from '@/types';
import { DoctorFormValues } from '@/validators';

export function useDoctors(search?: string) {
  return useQuery<ApiResponse<Doctor[]>, Error, Doctor[]>({
    queryKey: ['doctors', search],
    queryFn: () => api.get('/doctors', { params: { search } }),
    select: (response) => response.data,
  });
}

export function useDoctor(id: string) {
  return useQuery<ApiResponse<Doctor>, Error, Doctor>({
    queryKey: ['doctor', id],
    queryFn: () => api.get(`/doctors/${id}`),
    enabled: !!id,
    select: (response) => response.data,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Doctor>, Error, DoctorFormValues>({
    mutationFn: (data) => api.post('/doctors', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
  });
}

export function useUpdateDoctor(id: string) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Doctor>, Error, DoctorFormValues>({
    mutationFn: (data) => api.put(`/doctors/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', id] });
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<{ deleted: boolean }>, Error, string>({
    mutationFn: (id) => api.delete(`/doctors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
  });
}
