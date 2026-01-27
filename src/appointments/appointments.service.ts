import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      const doctor = await this.doctorRepository.findOne({
        where: { id: createAppointmentDto.doctorId },
      });
  
      if (!doctor) {
        throw new BadRequestException('Doctor not found');
      }
  
      const patient = await this.patientRepository.findOne({
        where: { id: createAppointmentDto.patientId },
      });
  
      if (!patient) {
        throw new BadRequestException('Patient not found');
      }
  
      const appointment = this.appointmentRepository.create(createAppointmentDto);
      console.log(appointment, 'appointment');
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to create appointment',
      );
    }
  }

  async findAll(): Promise<Appointment[]> {
    try {
      return await this.appointmentRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to fetch appointments',
      );
    }
  }

  async findOne(id: number): Promise<Appointment> {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      return appointment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Failed to fetch appointment',
      );
    }
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    try {
      const appointment = await this.findOne(id);
      Object.assign(appointment, updateAppointmentDto);
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to update appointment',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const appointment = await this.findOne(id);
      await this.appointmentRepository.remove(appointment);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to delete appointment',
      );
    }
  }
}
