import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/patient/entities/patient.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { BedManagement } from 'src/bed_management/entities/bed_management.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Appointment, BedManagement])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
