// dto/create-prescription.dto.ts
import {
    IsArray,
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class MedicineDto {
    @IsString()
    name: string;
  
    @IsString()
    frequency: string;
  
    @IsString()
    type: string;
  
    @IsNumber()
    days: number;
  
    @IsNumber()
    totalQuantity: number;
  }
  
  export class CreatePrescriptionDto {
    @IsString()
    diagnosis: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MedicineDto)
    medicines: MedicineDto[];
  
    @IsOptional()
    @IsString()
    notes?: string;
  
    @IsDateString()
    prescriptionDate: string;
  
    @IsNumber()
    patientId: number;
  
    @IsNumber()
    doctorId: number;
  }