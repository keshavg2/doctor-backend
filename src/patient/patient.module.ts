import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient } from './entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Hospital } from 'src/hospital/entities/hospital.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Appointment, Hospital])],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
