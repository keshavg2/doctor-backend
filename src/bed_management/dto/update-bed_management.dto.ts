import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { BedStatus } from "../entities/bed_management.entity";
import { Type } from "class-transformer";

export class UpdateBedManagementDto {
    @IsOptional()
    @IsString()
    bedNumber?: string;
  
    @IsOptional()
    @IsString()
    ward?: string;
  
    @IsOptional()
    @IsString()
    bedType?: string;
  
    @IsOptional()
    @IsEnum(BedStatus)
    status?: BedStatus;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    patientId?: number;
  }
  