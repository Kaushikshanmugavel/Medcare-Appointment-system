import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async findAll(search?: string): Promise<Doctor[]> {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }
    return this.doctorModel.find(filter).exec();
  }

  async findOne(id: string): Promise<DoctorDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid Doctor ID format: ${id}`);
    }
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const newDoctor = new this.doctorModel(createDoctorDto);
    return newDoctor.save();
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    await this.findOne(id); // Throws NotFoundException if doctor does not exist
    const updated = await this.doctorModel
      .findByIdAndUpdate(id, updateDoctorDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Doctor with ID ${id} not found during update`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    await this.findOne(id); // Throws NotFoundException if doctor does not exist
    await this.doctorModel.findByIdAndDelete(id).exec();
    return { deleted: true };
  }
}
