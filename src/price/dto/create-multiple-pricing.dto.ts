import {
    ArrayMinSize,
    IsArray,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { CreatePriceDto } from './create-price.dto';
  
  export class CreateMultiplePricingDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreatePriceDto)
    charges: CreatePriceDto[];
  }