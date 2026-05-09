import { Module } from '@nestjs/common';
import { HospitalInvoiceService } from './hospital_invoice.service';
import { HospitalInvoiceController } from './hospital_invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalInvoice } from './entities/hospital_invoice.entity';
import { InvoiceItem } from 'src/invoice-item/entities/invoice-item.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HospitalInvoice, InvoiceItem, Patient, Doctor])],
  controllers: [HospitalInvoiceController],
  providers: [HospitalInvoiceService],
})
export class HospitalInvoiceModule {}
