import { PartialType } from '@nestjs/mapped-types';
import { CreateBedManagementDto } from './create-bed_management.dto';

export class UpdateBedManagementDto extends PartialType(CreateBedManagementDto) {}
