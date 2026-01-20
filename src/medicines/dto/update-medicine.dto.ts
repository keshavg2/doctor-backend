import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';


export class UpdateMedicineDto{
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
}
