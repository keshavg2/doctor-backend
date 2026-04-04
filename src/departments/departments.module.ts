import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { Department } from './entities/department.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Doctor, Appointment])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {} 