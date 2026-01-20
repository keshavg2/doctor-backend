import { IsString, IsOptional } from 'class-validator';

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
}
