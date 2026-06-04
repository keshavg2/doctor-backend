import {
    IsString,
    IsNumber,
  } from 'class-validator';
  
  export class CreatePriceDto {
    @IsString()
    typeOfCharge: string;
  
    @IsNumber()
    charge: number;
  }