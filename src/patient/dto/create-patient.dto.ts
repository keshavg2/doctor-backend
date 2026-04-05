import { IsNotEmpty, IsString, IsPhoneNumber, IsOptional } from 'class-validator';
import { Gender } from '../entities/patient.entity';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  pincode: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  country: string;

  @IsOptional()
  email: string;

  @IsOptional()
  age: number;

  @IsOptional()
  gender: Gender;
}
