import {
    IsString,
    IsOptional,
    IsEnum,
    IsNumber,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { BedStatus } from '../entities/bed_management.entity';
  
  export class CreateBedManagementDto {
    @IsString()
    bedNumber: string;
  
    @IsString()
    ward: string;
  
    @IsString()
    bedType: string;
  
    @IsOptional()
    @IsEnum(BedStatus)
    status?: BedStatus;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    patientId?: number;
  }
  