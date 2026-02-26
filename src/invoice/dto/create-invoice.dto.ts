import {
    IsArray,
    ValidateNested,
    IsInt,
    IsString,
    Min,
    IsNumber,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class InvoiceMedicineDto {
    @IsInt()
    medicineId: number;
  
    @IsInt()
    @Min(1)
    quantity: number;
  
    @IsString()
    strength: string;
  
    @IsString()
    type: string;
  
    @IsNumber()
    @Min(0)
    price: number; // price per unit
  }
  
  export class CreateInvoiceDto {
    @IsInt()
    patientId: number;
  
    @IsInt()
    doctorId: number;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceMedicineDto)
    medicines: InvoiceMedicineDto[];
  
    @IsNumber()
    @Min(0)
    totalPrice: number;
  }
  