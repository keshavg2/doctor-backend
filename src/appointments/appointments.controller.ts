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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto,@Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.appointmentsService.create(createAppointmentDto, user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Appointment created successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create appointment',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('page') page: number = 1,
  @Query('limit') limit: number = 10, @Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.appointmentsService.findAll(page, limit, user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Appointments fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch appointments',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('count')
  async dashboardCounts(@Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.appointmentsService.getCardCounts(user);

      return {
        statusCode: HttpStatus.OK,
        message: 'Appointment counts fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch appointment counts',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const data = await this.appointmentsService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Appointment fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Appointment not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    try {
      const data = await this.appointmentsService.update(id, updateAppointmentDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Appointment updated successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to update appointment',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.appointmentsService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Appointment deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to delete appointment',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
