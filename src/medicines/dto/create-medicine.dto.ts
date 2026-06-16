import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { MedicineStatus } from '../entities/medicine.entity';

export class CreateMedicineDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  strength?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsNumber() 
  quantity: string;

  @IsOptional()
  @IsNumber()
  price: string;

  @IsOptional()
  @IsEnum(MedicineStatus)
  status?: MedicineStatus;
}
