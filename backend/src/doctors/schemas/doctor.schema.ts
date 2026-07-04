import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  specialization: string;

  @Prop({ required: true })
  availableStartTime: string; // HH:mm format, e.g., "09:00"

  @Prop({ required: true })
  availableEndTime: string; // HH:mm format, e.g., "17:00"

  @Prop({ required: true, default: 'UTC' })
  timezone: string;

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ type: [String], default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] })
  workingDays: string[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

// Index name and specialization for fast searches
DoctorSchema.index({ name: 'text', specialization: 'text' });
