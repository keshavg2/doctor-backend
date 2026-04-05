import { IsNotEmpty, IsString, IsPhoneNumber, IsOptional } from 'class-validator';
import { Gender } from '../entities/patient.entity';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

  @IsOptional()
  pincode: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  country: string;

  @IsOptional()
  email: string;

  @IsOptional()
  age: number;

  @IsOptional()
  gender: Gender;
}

export class AssignDoctorDto {
  @IsNotEmpty()
  doctorId: number
}