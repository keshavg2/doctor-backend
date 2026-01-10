import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, IsPhoneNumber, MinLength } from 'class-validator';

import { Role } from '../../user/enums/role.enum';

export class CreateAuthDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsPhoneNumber('IN')
  phone: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
