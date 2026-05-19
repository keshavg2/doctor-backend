// prescription.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  InternalServerErrorException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('prescription')
export class PrescriptionController {
  constructor(private readonly service: PrescriptionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreatePrescriptionDto, @Req() req: AuthRequest) {
    try {
      const user = req.user;
      return await this.service.create(dto, user);
    } catch (error) {
      console.error('Controller Create Error:', error);
      throw error?.status
        ? error
        : new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: AuthRequest) {
    try {
      const user = req.user;
      return await this.service.findAll(user);
    } catch (error) {
      console.error('Controller FindAll Error:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.service.findOne(+id);
    } catch (error) {
      console.error(`Controller FindOne Error (id=${id}):`, error);
      throw error?.status
        ? error
        : new InternalServerErrorException(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    try {
      return await this.service.update(+id, dto);
    } catch (error) {
      console.error(`Controller Update Error (id=${id}):`, error);
      throw error?.status
        ? error
        : new InternalServerErrorException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.service.remove(+id);
    } catch (error) {
      console.error(`Controller Delete Error (id=${id}):`, error);
      throw new InternalServerErrorException(error.message);
    }
  }
}