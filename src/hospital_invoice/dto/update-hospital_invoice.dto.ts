import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalInvoiceDto } from './create-hospital_invoice.dto';

export class UpdateHospitalInvoiceDto extends PartialType(CreateHospitalInvoiceDto) {}
