import { IsBoolean } from 'class-validator';

export class MedicineListDto {
  @IsBoolean()
  isActive: boolean;
}
