import { IsString, IsOptional, IsNumber } from 'class-validator';

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
}
