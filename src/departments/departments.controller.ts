import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      return await this.departmentsService.create(createDepartmentDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create department',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.departmentsService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch departments',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.departmentsService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Department not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    try {
      return await this.departmentsService.update(+id, updateDepartmentDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update department',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.departmentsService.remove(+id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete department',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}