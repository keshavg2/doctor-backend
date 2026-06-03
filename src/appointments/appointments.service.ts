import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { Brackets } from 'typeorm';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) { }

  async create(createAppointmentDto: CreateAppointmentDto, user: any): Promise<Appointment> {
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

      const appointment = this.appointmentRepository.create({ ...createAppointmentDto, createdBy: { id: user.userId }, hospitalId: user.hospitalId });
      console.log(appointment, 'appointment');
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to create appointment',
      );
    }
  }

  // async findAll(page: number = 1, limit: number = 10, user: any, search: string | undefined){
  //   try {
  //     const skip = (page - 1) * limit;
  //     const [appointments, total] =  await this.appointmentRepository.findAndCount({
  //       where:{
  //         hospitalId: user.hospitalId
  //       },
  //       order: { createdAt: 'DESC' },
  //       skip,
  //       take: limit,
  //     });

  //     return {
  //       appointments,
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit),
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(
  //       error.message || 'Failed to fetch appointments',
  //     );
  //   }
  // }


  async findAll(
    page: number = 1,
    limit: number = 10,
    user: any,
    search?: string,
  ) {
    try {
      const skip = (page - 1) * limit;

      const queryBuilder = this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .leftJoinAndSelect('appointment.doctor', 'doctor')
        .where('appointment.hospitalId = :hospitalId', {
          hospitalId: user.hospitalId,
        });

      if (search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('patient.patientNumber LIKE :search', {
              search: `%${search}%`,
            })
              .orWhere('patient.name LIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('doctor.name LIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
      }

      const [appointments, total] = await queryBuilder
        .orderBy('appointment.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        appointments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
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

  async getCardCounts(user: any) {
    const totalAppointments = await this.appointmentRepository.count({
      where: {
        hospitalId: user.hospitalId,
      }
    });

    const scheduled = await this.appointmentRepository.count({
      where: {
        status: AppointmentStatus.SCHEDULED,
        hospitalId: user.hospitalId,
      },
    });

    const completed = await this.appointmentRepository.count({
      where: {
        status: AppointmentStatus.COMPLETED,
        hospitalId: user.hospitalId,
      },
    });

    const cancelled = await this.appointmentRepository.count({
      where: { status: AppointmentStatus.CANCELLED, hospitalId: user.hospitalId },
    });

    return {
      totalAppointments,
      scheduled,
      completed,
      cancelled,
    };
  }
}
