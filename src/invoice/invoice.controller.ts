import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    try {
          const data = this.invoiceService.create(createInvoiceDto);
          return {
            statusCode: HttpStatus.OK,
            message: 'Invoice created successfully',
            data,
          };
        } catch (error) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: error.message || 'Failed to create Invoice',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
  }

  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(+id);
  }
}
