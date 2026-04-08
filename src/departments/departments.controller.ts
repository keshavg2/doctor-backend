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
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto,  @Req() req: AuthRequest) {
    try {
      const user =  req.user;
      return await this.departmentsService.create(createDepartmentDto, user);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create department',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('page') page: number = 1,
    @Query('limit') limit: number = 10,  @Req() req: AuthRequest) {
    try {
      const user =  req.user;
      return await this.departmentsService.findAll(page, limit, user);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch departments',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('count')
  async getCounts(@Req() req: AuthRequest) {
    try {
      const user =  req.user;
      const data = await this.departmentsService.getDepartmentCounts(user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Patient Count',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to Load patient Count',
        },
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