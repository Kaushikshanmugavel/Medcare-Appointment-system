import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doctor } from '../../doctors/schemas/doctor.schema';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ required: true, unique: true })
  appointmentId: string; // MED-1001, MED-1002...

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true, index: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  patientName: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  problemDescription: string;

  @Prop({ required: true, index: true })
  appointmentDate: string; // YYYY-MM-DD

  @Prop({ required: true })
  appointmentTime: string; // HH:mm format

  @Prop({ required: true, enum: ['scheduled', 'cancelled'], default: 'scheduled' })
  status: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// Compound index to guarantee uniqueness of doctor-date-time combinations
AppointmentSchema.index({ doctorId: 1, appointmentDate: 1, appointmentTime: 1 }, { unique: true });
