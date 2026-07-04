import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DoctorsModule } from '../doctors/doctors.module';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [DoctorsModule, AppointmentsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
