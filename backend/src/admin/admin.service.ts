import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';

@Injectable()
export class AdminService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  verifySecretKey(secretKey: string): { verified: boolean } {
    const configuredKey = this.configService.get<string>('secretKey');
    if (secretKey !== configuredKey) {
      throw new UnauthorizedException('Invalid Secret Key. Access denied.');
    }
    return { verified: true };
  }

  async getDashboardMetrics(): Promise<{
    totalDoctors: number;
    availableDoctors: number;
    todayAppointments: number;
    totalAppointments: number;
  }> {
    // Format today's date in local server YYYY-MM-DD
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localToday = new Date(now.getTime() - offset * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const [totalDoctors, availableDoctors, todayAppointments, totalAppointments] = await Promise.all([
      this.doctorModel.countDocuments().exec(),
      this.doctorModel.countDocuments({ status: 'active' }).exec(),
      this.appointmentModel.countDocuments({ appointmentDate: localToday, status: 'scheduled' }).exec(),
      this.appointmentModel.countDocuments().exec(),
    ]);

    return {
      totalDoctors,
      availableDoctors,
      todayAppointments,
      totalAppointments,
    };
  }
}
