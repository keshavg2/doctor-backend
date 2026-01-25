import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvoiceMedicinesService } from './invoice_medicines.service';
import { CreateInvoiceMedicineDto } from './dto/create-invoice_medicine.dto';
import { UpdateInvoiceMedicineDto } from './dto/update-invoice_medicine.dto';

@Controller('invoice-medicines')
export class InvoiceMedicinesController {
  constructor(private readonly invoiceMedicinesService: InvoiceMedicinesService) {}

  @Post()
  create(@Body() createInvoiceMedicineDto: CreateInvoiceMedicineDto) {
    return this.invoiceMedicinesService.create(createInvoiceMedicineDto);
  }

  @Get()
  findAll() {
    return this.invoiceMedicinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceMedicinesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceMedicineDto: UpdateInvoiceMedicineDto) {
    return this.invoiceMedicinesService.update(+id, updateInvoiceMedicineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceMedicinesService.remove(+id);
  }
}
