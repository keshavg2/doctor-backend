import {
    IsOptional,
    IsUUID,
    IsDateString,
    IsIn,
    IsString,
    IsEnum,
    IsNumber,
  } from 'class-validator';
import { AppointmentType } from '../entities/appointment.entity';
  
  export class UpdateAppointmentDto {
    @IsOptional()
    @IsNumber()
    doctorId?: number;
  
    @IsOptional()
    @IsNumber()
    patientId?: number;
  
    @IsOptional()
    @IsDateString()
    appointmentDate?: string;
  
    @IsOptional()
    @IsIn(['scheduled', 'completed', 'cancelled'])
    status?: 'scheduled' | 'completed' | 'cancelled';
  
    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsEnum(AppointmentType)
    type?: AppointmentType;
  }
  