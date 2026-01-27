import { IsUUID, IsDateString, IsOptional, IsString, IsIn, IsEnum, IsNumber } from 'class-validator';
import { AppointmentStatus, AppointmentType } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsNumber()
  patientId: number;

  @IsNumber()
  doctorId: number;

  @IsDateString()
  appointmentDate: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsEnum(AppointmentType)
  type: AppointmentType;
}
