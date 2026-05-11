// invoice.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { HospitalInvoiceService } from './hospital_invoice.service';
import { CreateHospitalInvoiceDto } from './dto/create-hospital_invoice.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('hospital_invoice')
export class HospitalInvoiceController {
  constructor(private readonly invoiceService: HospitalInvoiceService) { }

  @Post()
  async create(@Body() createInvoiceDto: CreateHospitalInvoiceDto) {
    try {
      return await this.invoiceService.create(createInvoiceDto);
    } catch (error) {
      throw error;
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: AuthRequest
  ) {
    try {
      // const user = req.user
      const data = await this.invoiceService.findAll(
        Number(page) || 1,
        Number(limit) || 10,
        // user
      );

      return {
              statusCode: HttpStatus.OK,
              message: 'Invoice fetched successfully',
              data,
            };
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