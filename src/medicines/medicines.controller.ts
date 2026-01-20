import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Query } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicineListDto } from './dto/medicine-list.dto';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  async create(@Body() createMedicineDto: CreateMedicineDto) {
    try {
          const data = await this.medicinesService.create(createMedicineDto);
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

  @Get()
  async findAll() {
    try {
      const data = await this.medicinesService.findAll();
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
    try{
    return this.medicinesService.update(+id, updateMedicineDto);
  }catch(error){
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
    try{
    return this.medicinesService.remove(+id);
    } catch(error){
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
