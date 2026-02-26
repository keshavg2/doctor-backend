import { Injectable } from '@nestjs/common';
import { CreateInvoiceMedicineDto } from './dto/create-invoice_medicine.dto';
import { UpdateInvoiceMedicineDto } from './dto/update-invoice_medicine.dto';

@Injectable()
export class InvoiceMedicinesService {
  create(createInvoiceMedicineDto: CreateInvoiceMedicineDto) {
    return 'This action adds a new invoiceMedicine';
  }

  findAll() {
    return `This action returns all invoiceMedicines`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoiceMedicine`;
  }

  update(id: number, updateInvoiceMedicineDto: UpdateInvoiceMedicineDto) {
    return `This action updates a #${id} invoiceMedicine`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoiceMedicine`;
  }
}
