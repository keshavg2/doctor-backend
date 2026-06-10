// invoice.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createInvoiceDto: CreateHospitalInvoiceDto, @Req() req: AuthRequest) {
    try {
      const user = req.user;
      return await this.invoiceService.create(createInvoiceDto, user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: AuthRequest,
    @Query('search') search?: string,
  ) {
    try {
      const user = req.user
      const data = await this.invoiceService.findAll(
        Number(page) || 1,
        Number(limit) || 10,
        user,
        search
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

  @UseGuards(AuthGuard('jwt'))
  @Get('count')
  async getInvoiceStats(@Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.invoiceService.getHospitalInvoiceStats(user);

      return {
        statusCode: HttpStatus.OK,
        message: 'Invoice data fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetched invoice count',
        },
        HttpStatus.BAD_REQUEST,
      );
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

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: Partial<CreateHospitalInvoiceDto>,
    @Req() req: AuthRequest,
  ) {
    try {
      const user = req.user;

      const data = await this.invoiceService.update(
        id,
        updateInvoiceDto,
        user,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Invoice updated successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to update invoice',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
  ) {
    try {
      const user = req.user;

      const data = await this.invoiceService.remove(
        id,
        user,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Invoice deleted successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to delete invoice',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
