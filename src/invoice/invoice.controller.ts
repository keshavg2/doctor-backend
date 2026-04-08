import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.invoiceService.create(createInvoiceDto, user);

      return {
        statusCode: HttpStatus.OK,
        message: 'Invoice created successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create invoice',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: AuthRequest
  ) {
    try {
      const user = req.user;
      const data = await this.invoiceService.findAll(page, limit, user);

      return {
        statusCode: HttpStatus.OK,
        message: 'Invoices fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch invoices',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('count')
  async getInvoiceStats(@Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.invoiceService.getInvoiceStats(user);

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
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.invoiceService.findOne(+id);

      return {
        statusCode: HttpStatus.OK,
        message: 'Invoice fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Invoice not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    try {
      const data = await this.invoiceService.update(+id, updateInvoiceDto);

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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.invoiceService.remove(+id);

      return {
        statusCode: HttpStatus.OK,
        message: 'Invoice deleted successfully',
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