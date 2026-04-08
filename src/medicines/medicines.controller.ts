import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Query, UseGuards, Req } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicineListDto } from './dto/medicine-list.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createMedicineDto: CreateMedicineDto, @Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.medicinesService.create(createMedicineDto, user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Medicine created successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create medicines',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: AuthRequest) {
    try {
      const user = req.user
      const data = await this.medicinesService.findAll(page, limit, user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Medicines fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch Medicines',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('count')
  async dashboardCounts( @Req() req: AuthRequest) {
    try {
      const user = req.user
      const data = await this.medicinesService.getCardCounts(user);

      return {
        statusCode: HttpStatus.OK,
        message: 'Dashboard counts fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch medicines count',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.medicinesService.findOne(Number(id));
      return {
        statusCode: HttpStatus.OK,
        message: 'Medicines fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch medicines',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicineDto: UpdateMedicineDto) {
    try {
      return this.medicinesService.update(+id, updateMedicineDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to Update medicines',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.medicinesService.remove(+id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to Delete medicines',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
