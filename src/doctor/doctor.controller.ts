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
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) { }

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    try {
      const data = await this.doctorService.create(createDoctorDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'Doctor created successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create doctor',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const data = await this.doctorService.findAll(page, limit);

      return {
        statusCode: HttpStatus.OK,
        message: 'Doctors fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch doctors',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('count')
  async getCounts() {
    try {
      const data = await this.doctorService.getDoctorCounts();
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
      const data = await this.doctorService.findOne(+id);

      return {
        statusCode: HttpStatus.OK,
        message: 'Doctor fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Doctor not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    try {
      const data = await this.doctorService.update(+id, updateDoctorDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'Doctor updated successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to update doctor',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.doctorService.remove(+id);

      return {
        statusCode: HttpStatus.OK,
        message: 'Doctor deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to delete doctor',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}