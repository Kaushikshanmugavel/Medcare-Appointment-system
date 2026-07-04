import { z } from 'zod';

export const adminLoginSchema = z.object({
  secretKey: z.string().min(1, 'Secret Key is required to access the admin panel'),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialization: z.string().min(2, 'Specialization must be at least 2 characters'),
  availableStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format (e.g. 09:00)',
  }),
  availableEndTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:mm format (e.g. 17:00)',
  }),
  timezone: z.string().min(1, 'Timezone is required'),
  status: z.enum(['active', 'inactive']),
  workingDays: z.array(z.string()).min(1, 'Select at least one working day'),
});

export type DoctorFormValues = z.infer<typeof doctorSchema>;

export const bookingSchema = z.object({
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  age: z.coerce.number().int().min(1, 'Age must be at least 1').max(120, 'Age cannot exceed 120'),
  problemDescription: z.string().min(5, 'Please describe your symptoms in at least 5 characters'),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Invalid date selection',
  }),
  appointmentTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Invalid slot selection',
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
