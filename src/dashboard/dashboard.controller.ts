import { Controller, Get, Post, Body, HttpStatus, HttpException, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('recent-patient')
  async recentPatientList(@Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.dashboardService.recentPatientList(user);

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

  @UseGuards(AuthGuard('jwt'))
  @Get('recent-appointment')
  async recentAppointmentList(@Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.dashboardService.recentAppointmentList(user);

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

  @UseGuards(AuthGuard('jwt'))
  @Get('count')
  async dashboardCounts(@Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.dashboardService.getDashboardCounts(user);

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
