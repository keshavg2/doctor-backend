import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { Patient } from 'src/patient/entities/patient.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { BedManagement, BedStatus } from 'src/bed_management/entities/bed_management.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(BedManagement)
    private readonly bedRepository: Repository<BedManagement>,
  ) { }

  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  async recentPatientList(user: any) {
    try {
      return await this.patientRepository.find({
        where: {
          hospitalId: user.hospitalId
        },
        order: { createdAt: 'DESC' },
        take: 4,
      });
    } catch (e) {
      console.error('Error in recent patient list:', e);
      return [];
    }
  }

  async recentAppointmentList(user: any) {
    try {
      return await this.appointmentRepository.find({
        where: {
          hospitalId: user.hospitalId
        },
        order: { createdAt: 'DESC' },
        take: 4,
        relations: ['patient', 'doctor'], // optional
      });
    } catch (e) {
      console.error('Error in recent appointment list:', e);
      return [];
    }
  }

  async getDashboardCounts(user: any) {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const [
        totalPatients,
        todayAppointments,
        availableBeds,
      ] = await Promise.all([
        this.patientRepository.count({
          where: {
            hospitalId: user.hospitalId
          }
        }),

        this.appointmentRepository.count({
          where: {
            hospitalId: user.hospitalId,
            appointmentDate: Between(todayStart, todayEnd),
          },
        }),

        this.bedRepository.count({
          where: {
            status: BedStatus.AVAILABLE,
            hospitalId: user.hospitalId
          },
        }),
      ]);

      return {
        totalPatients,
        todayAppointments,
        availableBeds,
      };
    } catch (e) {
      console.error('Error in dashboard counts:', e);
      return {
        totalPatients: 0,
        todayAppointments: 0,
        availableBeds: 0,
      };
    }
  }
}
