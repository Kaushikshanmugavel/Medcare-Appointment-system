import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    private doctorsService: DoctorsService,
  ) {}

  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  async bookAppointment(createDto: CreateAppointmentDto): Promise<Appointment> {
    const { doctorId, appointmentDate, appointmentTime, patientName, age, problemDescription } = createDto;

    // 1. Verify doctor exists and is active
    const doctor = await this.doctorsService.findOne(doctorId);
    if (doctor.status !== 'active') {
      throw new BadRequestException('The selected doctor is currently inactive and cannot receive bookings.');
    }

    // 2. Validate doctor working days
    const [year, month, day] = appointmentDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const requestedDay = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    if (!doctor.workingDays.includes(requestedDay)) {
      throw new BadRequestException(
        `Doctor ${doctor.name} does not work on ${requestedDay}s. Working days: ${doctor.workingDays.join(', ')}`,
      );
    }

    // 3. Validate doctor working hours
    const slotMinutes = this.timeToMinutes(appointmentTime);
    const startMinutes = this.timeToMinutes(doctor.availableStartTime);
    const endMinutes = this.timeToMinutes(doctor.availableEndTime);

    // Slots are 30 minutes, so an appointment starting at slotMinutes must end by endMinutes
    if (slotMinutes < startMinutes || slotMinutes + 30 > endMinutes) {
      throw new BadRequestException(
        `Selected time slot ${appointmentTime} is outside doctor's working hours (${doctor.availableStartTime} - ${doctor.availableEndTime}).`,
      );
    }

    // Minutes must be multiples of 30
    if (slotMinutes % 30 !== 0) {
      throw new BadRequestException('Appointments can only be booked in 30-minute intervals (e.g. 09:00, 09:30).');
    }

    // 4. Validate double-booking collision
    const existingOverlapping = await this.appointmentModel.findOne({
      doctorId: new Types.ObjectId(doctorId),
      appointmentDate,
      appointmentTime,
      status: 'scheduled',
    }).exec();

    if (existingOverlapping) {
      throw new BadRequestException('This slot has already been booked. Please select a different time or date.');
    }

    // 5. Generate human-readable sequential ID (MED-1001, MED-1002...)
    const count = await this.appointmentModel.countDocuments().exec();
    const nextIdNum = 1001 + count;
    const appointmentId = `MED-${nextIdNum}`;

    const newAppointment = new this.appointmentModel({
      appointmentId,
      doctorId: new Types.ObjectId(doctorId),
      patientName,
      age,
      problemDescription,
      appointmentDate,
      appointmentTime,
      status: 'scheduled',
    });

    try {
      return await newAppointment.save();
    } catch (err) {
      // Catch potential parallel write duplicates
      if (err.code === 11000) {
        throw new BadRequestException('Concurrency conflict: This slot was just booked by another patient.');
      }
      throw err;
    }
  }

  async getAvailableSlots(doctorId: string, date: string): Promise<{ time: string; available: boolean }[]> {
    const doctor = await this.doctorsService.findOne(doctorId);

    // Check if the requested date is a working day
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const requestedDay = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    if (!doctor.workingDays.includes(requestedDay) || doctor.status !== 'active') {
      return [];
    }

    // Find all booked appointments for the doctor on that date
    const bookedAppointments = await this.appointmentModel.find({
      doctorId: new Types.ObjectId(doctorId),
      appointmentDate: date,
      status: 'scheduled',
    }).exec();

    const bookedSlotsSet = new Set(bookedAppointments.map(a => a.appointmentTime));

    const startMinutes = this.timeToMinutes(doctor.availableStartTime);
    const endMinutes = this.timeToMinutes(doctor.availableEndTime);

    const slots: { time: string; available: boolean }[] = [];

    for (let current = startMinutes; current + 30 <= endMinutes; current += 30) {
      const timeStr = this.minutesToTime(current);
      slots.push({
        time: timeStr,
        available: !bookedSlotsSet.has(timeStr),
      });
    }

    return slots;
  }

  async findAll(date?: string, doctorId?: string): Promise<Appointment[]> {
    const filter: any = {};
    if (date) {
      filter.appointmentDate = date;
    }
    if (doctorId && Types.ObjectId.isValid(doctorId)) {
      filter.doctorId = new Types.ObjectId(doctorId);
    }
    return this.appointmentModel.find(filter).populate('doctorId').exec();
  }

  async findOne(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }

    const appointment = await this.appointmentModel
      .findById(id)
      .populate('doctorId')
      .exec();

    if (!appointment) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }

    return appointment;
  }
}