import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.bookAppointment(createAppointmentDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  async findAll(
    @Query('date') date?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.appointmentsService.findAll(date, doctorId);
  }

  @Get('slots')
  async getSlots(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.appointmentsService.getAvailableSlots(doctorId, date);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }
}
