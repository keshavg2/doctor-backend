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
  Req,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientListFilterDto } from './dto/patient-list-filter.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssignDoctorDto, UpdatePatientDto } from './dto/update-patient.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('patient')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Doctor)
export class PatientController {
  constructor(private readonly patientService: PatientService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createPatientDto: CreatePatientDto, @Req() req: AuthRequest) {
    try {
      const user = req.user;
      // console.log(user);
      const data = await this.patientService.create(createPatientDto, user);
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

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query() filter: PatientListFilterDto, @Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.patientService.findAll(filter, user);
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

  @UseGuards(AuthGuard('jwt'))
  @Get('count')
  async getCounts(@Req() req: AuthRequest) {
    try {
      const user = req.user;
      const data = await this.patientService.getPatientCounts(user);
      console.log(data);
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

  @Patch(':id')
  async update(@Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto) {
    try {
      const data = await this.patientService.findOneAndUpdate(+id, updatePatientDto);
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

  @Patch(':id/assignDoctor')
  async assignDoctor(@Param('id') id: string,
    @Body() assignDoctorDto: AssignDoctorDto) {
    try {
      const data = await this.patientService.assignDoctortoPatient(+id, assignDoctorDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Assign Doctor to Patient',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to Assign Doctor',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
