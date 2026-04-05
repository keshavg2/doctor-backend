import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { Department } from 'src/departments/entities/department.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) { }

  async create(createDoctorDto: CreateDoctorDto) {
    try {
      const existingDoctor = await this.doctorRepo.findOne({
        where: { email: createDoctorDto.email },
      });

      if (existingDoctor) {
        throw new BadRequestException('Doctor email already exists');
      }

      const doctor = this.doctorRepo.create(createDoctorDto);

      return await this.doctorRepo.save(doctor);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [doctors, total] = await this.doctorRepo.findAndCount({
        where: {
          active: true,
        },
        relations: ['department'],
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });

      return {
        doctors,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const doctor = await this.doctorRepo.findOne({
        where: { id },
        relations: ['department'],
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      return doctor;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    try {
      const doctor = await this.doctorRepo.findOne({
        where: { id },
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      Object.assign(doctor, updateDoctorDto);

      return await this.doctorRepo.save(doctor);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const doctor = await this.doctorRepo.findOne({
        where: { id },
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      await this.doctorRepo.remove(doctor);

      return {
        message: 'Doctor deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getDoctorCounts() {
    try {
      const totalDoctors = await this.doctorRepo.count();

      const totalDepartments = await this.departmentRepo.count();

      const availableDoctors = await this.doctorRepo.count({
        where: {
          active: true,
        },
      });

      const unavailableDoctors = await this.doctorRepo.count({
        where: {
          active: false,
        },
      });

      return {
        totalDoctors,
        totalDepartments: Number(totalDepartments),
        availableDoctors,
        unavailableDoctors,
      };
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}