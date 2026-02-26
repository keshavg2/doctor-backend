import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceMedicineDto } from './create-invoice_medicine.dto';

export class UpdateInvoiceMedicineDto extends PartialType(CreateInvoiceMedicineDto) {}
