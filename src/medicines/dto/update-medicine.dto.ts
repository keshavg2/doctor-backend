import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { MedicineStatus } from '../entities/medicine.entity';


export class UpdateMedicineDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
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
