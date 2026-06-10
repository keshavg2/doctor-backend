// dto/create-invoice.dto.ts
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class InvoiceItemDto {
    @IsString()
    category: string;
  
    @IsString()
    chargeName: string;
  
    @IsNumber()
    qty: number;
  
    @IsNumber()
    rate: number;

    @IsNumber()
    amount: number;
  }
  
  export class CreateHospitalInvoiceDto {
    @IsNumber()
    patientId: number;
  
    @IsNumber()
    doctorId: number;
  
    @IsString()
    type: string;
  
    @IsBoolean()
    oxygenCharges: boolean;
  
    @IsOptional()
    @IsString()
    remarks: string;

    @IsOptional()
    @IsNumber()
    discount: number;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceItemDto)
    items: InvoiceItemDto[];
  }