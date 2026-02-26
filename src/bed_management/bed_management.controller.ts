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
} from '@nestjs/common';
import { BedManagementService } from './bed_management.service';
import { CreateBedManagementDto } from './dto/create-bed_management.dto';
import { UpdateBedManagementDto } from './dto/update-bed_management.dto';

@Controller('bed-management')
export class BedManagementController {
  constructor(private readonly bedManagementService: BedManagementService) {}

  @Post()
  async create(@Body() createBedManagementDto: CreateBedManagementDto) {
    try {
      const data = await this.bedManagementService.create(
        createBedManagementDto,
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

  @Get()
  async findAll() {
    try {
      const data = await this.bedManagementService.findAll();
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
