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

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsEnum(MedicineStatus)
  status?: MedicineStatus;
}
