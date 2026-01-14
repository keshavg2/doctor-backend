import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpException,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientListFilterDto } from './dto/patient-list-filter.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patient')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Doctor)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    try {
      const data = await this.patientService.create(createPatientDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Patient created successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create patient',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(@Query() filter: PatientListFilterDto) {
    try {
      const data = await this.patientService.findAll(filter);
      return {
        statusCode: HttpStatus.OK,
        message: 'Patients fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch patients',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.patientService.findOne(+id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Patient fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch patient',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @Patch(':id')
  // async update(@Param('id') id: string,
  // @Body() updatePatientDto: UpdatePatientDto) {
  //   try {
  //     const data = await this.patientService.findOneAndUpdate(+id);
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: 'Patient fetched successfully',
  //       data,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         message: error.message || 'Failed to fetch patient',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  
  

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const data = await this.patientService.remove(+id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Patient deleted successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to delete patient',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
