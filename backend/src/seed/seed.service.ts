import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async onModuleInit() {
    await this.seedDoctors();
  }

  async seedDoctors() {
    try {
      const count = await this.doctorModel.countDocuments().exec();
      if (count > 0) {
        this.logger.log('Database already contains doctor records. Skipping seeding.');
        return;
      }

      const doctorsToSeed: Partial<Doctor>[] = [
        {
          name: 'Dr. Sarah Jenkins',
          specialization: 'Cardiology',
          availableStartTime: '09:00',
          availableEndTime: '17:00',
          timezone: 'UTC',
          status: 'active',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        },
        {
          name: 'Dr. Alex Carter',
          specialization: 'Neurology',
          availableStartTime: '10:00',
          availableEndTime: '16:00',
          timezone: 'America/New_York',
          status: 'active',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        },
        {
          name: 'Dr. Emily Ross',
          specialization: 'Pediatrics',
          availableStartTime: '08:00',
          availableEndTime: '15:00',
          timezone: 'Europe/London',
          status: 'active',
          workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        },
        {
          name: 'Dr. Michael Chang',
          specialization: 'Orthopedics',
          availableStartTime: '09:00',
          availableEndTime: '16:30',
          timezone: 'Asia/Singapore',
          status: 'active',
          workingDays: ['Monday', 'Wednesday', 'Friday'],
        },
        {
          name: 'Dr. Sophia Patel',
          specialization: 'Dermatology',
          availableStartTime: '09:30',
          availableEndTime: '17:30',
          timezone: 'Asia/Kolkata',
          status: 'active',
          workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        },
        {
          name: 'Dr. David Miller',
          specialization: 'General Medicine',
          availableStartTime: '08:30',
          availableEndTime: '18:00',
          timezone: 'America/Chicago',
          status: 'active',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        },
        {
          name: 'Dr. Olivia Taylor',
          specialization: 'Psychiatry',
          availableStartTime: '11:00',
          availableEndTime: '19:00',
          timezone: 'America/Los_Angeles',
          status: 'active',
          workingDays: ['Monday', 'Wednesday', 'Thursday'],
        },
        {
          name: 'Dr. James Wilson',
          specialization: 'Ophthalmology',
          availableStartTime: '09:00',
          availableEndTime: '15:00',
          timezone: 'Australia/Sydney',
          status: 'active',
          workingDays: ['Tuesday', 'Thursday', 'Friday'],
        },
        {
          name: 'Dr. Jessica Lee',
          specialization: 'Gynecology',
          availableStartTime: '08:00',
          availableEndTime: '16:00',
          timezone: 'Asia/Seoul',
          status: 'active',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
        },
        {
          name: 'Dr. Robert Chen',
          specialization: 'Gastroenterology',
          availableStartTime: '10:00',
          availableEndTime: '18:00',
          timezone: 'Asia/Shanghai',
          status: 'active',
          workingDays: ['Tuesday', 'Wednesday', 'Thursday'],
        },
        {
          name: 'Dr. Lisa Anderson',
          specialization: 'Endocrinology',
          availableStartTime: '09:00',
          availableEndTime: '17:00',
          timezone: 'Europe/Paris',
          status: 'active',
          workingDays: ['Monday', 'Wednesday', 'Friday'],
        },
        {
          name: 'Dr. William Garcia',
          specialization: 'Oncology',
          availableStartTime: '08:30',
          availableEndTime: '14:30',
          timezone: 'America/Sao_Paulo',
          status: 'active',
          workingDays: ['Monday', 'Tuesday', 'Thursday'],
        },
      ];

      await this.doctorModel.insertMany(doctorsToSeed);
      this.logger.log('Successfully seeded 12 professional doctors into Database.');
    } catch (error) {
      this.logger.error('Failed to seed doctors into Database:', error);
    }
  }
}
