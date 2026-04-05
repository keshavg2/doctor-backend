import { Controller, Get, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('recent-patient')
  async recentPatientList() {
    try {
      const data = await this.dashboardService.recentPatientList();

      return {
        statusCode: HttpStatus.OK,
        message: 'Recent patients fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to fetch recent patients',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('recent-appointment')
  async recentAppointmentList() {
    try {
      const data = await this.dashboardService.recentAppointmentList();

      return {
        statusCode: HttpStatus.OK,
        message: 'Recent appointments fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to fetch recent appointments',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  async dashboardCounts() {
    try {
      const data = await this.dashboardService.getDashboardCounts();

      return {
        statusCode: HttpStatus.OK,
        message: 'Dashboard counts fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to fetch dashboard counts',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
