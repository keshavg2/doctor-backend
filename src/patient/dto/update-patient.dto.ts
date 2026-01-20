import { IsNotEmpty, IsString, IsPhoneNumber, IsOptional } from 'class-validator';

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
}

export class AssignDoctorDto{
    @IsNotEmpty()
    doctorId: number
}