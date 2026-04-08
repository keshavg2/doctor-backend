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
import { BedManagementService } from './bed_management.service';
import { CreateBedManagementDto } from './dto/create-bed_management.dto';
import { UpdateBedManagementDto } from './dto/update-bed_management.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('bed-management')
export class BedManagementController {
  constructor(private readonly bedManagementService: BedManagementService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createBedManagementDto: CreateBedManagementDto, @Req() req: AuthRequest) {
    try {
      const user = req.user
      const data = await this.bedManagementService.create(
        createBedManagementDto,
        user
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Bed created successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create bed',
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
      const user = req.user
      const data = await this.bedManagementService.findAll(page, limit, user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Beds fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch beds',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('count')
  async dashboardCounts(@Req() req: AuthRequest) {
    try {
      const user = req.user
      const data = await this.bedManagementService.getCardCounts(user);

      return {
        statusCode: HttpStatus.OK,
        message: 'Bed counts fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch bed counts',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const bedId = parseInt(id, 10);
      const data = await this.bedManagementService.findOne(bedId);

      return {
        statusCode: HttpStatus.OK,
        message: 'Bed fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Bed not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBedManagementDto: UpdateBedManagementDto,
  ) {
    try {
      const bedId = parseInt(id, 10);
      const data = await this.bedManagementService.update(
        bedId,
        updateBedManagementDto,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Bed updated successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to update bed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const bedId = parseInt(id, 10);
      await this.bedManagementService.remove(bedId);

      return {
        statusCode: HttpStatus.OK,
        message: 'Bed deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to delete bed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
