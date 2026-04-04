import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Appointment, AppointmentStatus } from 'src/appointments/entities/appointment.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      const existingDepartment = await this.departmentRepository.findOne({
        where: { departmentName: createDepartmentDto.departmentName },
      });

      if (existingDepartment) {
        throw new BadRequestException('Department already exists');
      }

      const department = this.departmentRepository.create(createDepartmentDto);

      const savedDepartment = await this.departmentRepository.save(department);

      return {
        message: 'Department created successfully',
        data: savedDepartment,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      // const departments = await this.departmentRepository.find();
      const skip = (page - 1) * limit;

    const [departments, total] = await this.departmentRepository.findAndCount({
      order: {
        id: 'DESC',
      },
      skip,
      take: limit,
    });

    return {
      departments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

      return {
        message: 'Departments fetched successfully',
        data: departments,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      return {
        message: 'Department fetched successfully',
        data: department,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      Object.assign(department, updateDepartmentDto);

      const updatedDepartment = await this.departmentRepository.save(department);

      return {
        message: 'Department updated successfully',
        data: updatedDepartment,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      await this.departmentRepository.remove(department);

      return {
        message: 'Department deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentCounts() {
    const totalDepartments = await this.departmentRepository.count();
  
    const totalDoctors = await this.doctorRepository.count();
  
    const visitedPatients = await this.appointmentRepository.count({
      where: {
        status: AppointmentStatus.COMPLETED,
      },
    });
  
    const unvisitedPatients = await this.appointmentRepository.count({
      where: {
        status: AppointmentStatus.SCHEDULED,
      },
    });
  
    return {
      totalDoctors,
      totalDepartments,
      visitedPatients,
      unvisitedPatients,
    };
  }
}