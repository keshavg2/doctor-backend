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
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';


@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto, @Req() req: AuthRequest) {
    try {
      const user = req.user
      const data = await this.doctorService.create(createDoctorDto, user);

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

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: AuthRequest
  ) {
    try {
      const user = req.user;
      const data = await this.doctorService.findAll(page, limit, user);

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

  @UseGuards(AuthGuard('jwt'))
  @Get('count')
  async getCounts(@Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.doctorService.getDoctorCounts(user);
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