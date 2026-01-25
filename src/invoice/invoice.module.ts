import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice } from '../invoice/entities/invoice.entity';
import { InvoiceMedicine } from 'src/invoice_medicines/entities/invoice_medicine.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceMedicine])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
