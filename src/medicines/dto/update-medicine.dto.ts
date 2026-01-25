import { IsOptional, IsString, IsNumber } from 'class-validator';


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

    @IsOptional()
    @IsNumber()
    quantity: number;
    
    @IsOptional()
    @IsNumber()
    price: number; 
}
