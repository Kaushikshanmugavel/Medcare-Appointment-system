export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  availableStartTime: string;
  availableEndTime: string;
  timezone: string;
  status: 'active' | 'inactive';
  workingDays: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  appointmentId: string;
  doctorId: Doctor | string;
  patientName: string;
  age: number;
  problemDescription: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
