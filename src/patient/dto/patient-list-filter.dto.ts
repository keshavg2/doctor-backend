import { IsOptional, IsString, IsNumberString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PatientListFilterDto {
  // 🔍 Search (name / phone)
  @IsOptional()
  @IsString()
  search?: string;

  // 📍 Location filters
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumberString()
  pincode?: string;

  // 📞 Phone filter
  @IsOptional()
  @IsString()
  phone?: string;

  // 📄 Pagination
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  // ↕ Sorting
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'id' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
