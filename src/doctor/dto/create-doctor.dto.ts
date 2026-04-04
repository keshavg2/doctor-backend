import {
    IsString,
    IsEmail,
    IsOptional,
    Length,
    IsNumber,
    isBoolean,
    IsBoolean,
  } from 'class-validator';
  
  export class CreateDoctorDto {
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    hospitalName?: string;
  
    @IsNumber()
    departmentId: number;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @Length(10, 15)
    phone: string;
  
    @IsOptional()
    @IsString()
    address?: string;
  
    @IsOptional()
    @IsString()
    pincode?: string;
  
    @IsOptional()
    @IsString()
    city?: string;
  
    @IsOptional()
    @IsString()
    state?: string;
  
    @IsOptional()
    @IsString()
    country?: string;

    @IsString()
    qualification: string;

    @IsOptional()
    @IsBoolean()
    active: boolean;
  }