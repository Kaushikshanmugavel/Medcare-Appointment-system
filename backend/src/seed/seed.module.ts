import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [DoctorsModule],
  providers: [SeedService],
})
export class SeedModule {}
