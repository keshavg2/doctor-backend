// invoice.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { HospitalInvoiceService } from './hospital_invoice.service';
import { CreateHospitalInvoiceDto } from './dto/create-hospital_invoice.dto';

@Controller('hospital_invoice')
export class HospitalInvoiceController {
  constructor(private readonly invoiceService: HospitalInvoiceService) {}

  @Post()
  async create(@Body() createInvoiceDto: CreateHospitalInvoiceDto) {
    try {
      return await this.invoiceService.create(createInvoiceDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.invoiceService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.invoiceService.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}