import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientListFilterDto } from './dto/patient-list-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Between, Repository } from 'typeorm';
import { AssignDoctorDto, UpdatePatientDto } from './dto/update-patient.dto';
import { AppointmentStatus } from 'src/appointments/entities/appointment.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) { }

  async create(createPatientDto: CreatePatientDto, user: any) {
    try {
      const {
        name,
        phone,
        address,
        city,
        state,
        country,
        pincode,
        email,
        age,
        gender,
      } = createPatientDto;

      console.log(user);
      const patient = this.patientRepository.create({
        name,
        phone,
        address,
        city,
        state,
        country,
        pincode,
        email,
        age,
        gender,
        createdBy: {id: user.userId},
        hospitalId: user.hospitalId,
      });

      return await this.patientRepository.save(patient);
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to create patient',
      );
    }
  }

  async findAll(filter: PatientListFilterDto, user: any) {
    try {
      const {
        search,
        city,
        state,
        country,
        pincode,
        phone,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = filter;

      const hospitalId = user?.hospitalId

      const qb = this.patientRepository
        .createQueryBuilder('patient')
        .leftJoinAndSelect('patient.user', 'user');

      // 🔍 Search
      if (search) {
        qb.andWhere(
          '(user.name ILIKE :search OR patient.phone ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (phone) {
        qb.andWhere('patient.phone = :phone', { phone });
      }

      if (city) {
        qb.andWhere('patient.city ILIKE :city', { city: `%${city}%` });
      }

      if (state) {
        qb.andWhere('patient.state ILIKE :state', { state: `%${state}%` });
      }

      if (country) {
        qb.andWhere('patient.country ILIKE :country', {
          country: `%${country}%`,
        });
      }

      if (pincode) {
        qb.andWhere('patient.pincode = :pincode', { pincode });
      }

      if(hospitalId){
        qb.andWhere('patient.hospitalId = :hospitalId', {hospitalId})
      }

      qb.orderBy(`patient.${sortBy}`, sortOrder);
      qb.skip((page - 1) * limit).take(limit);

      const [data, total] = await qb.getManyAndCount();

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch patients',
      );
    }
  }

  async findOne(id: number) {
    try {
      const patient = await this.patientRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!patient) {
        throw new BadRequestException('Patient not found');
      }

      return patient;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch patient',
      );
    }
  }

  async remove(id: number) {
    try {
      const result = await this.patientRepository.delete(id);

      if (result.affected === 0) {
        throw new BadRequestException('Patient not found');
      }

      return { message: 'Patient deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to delete patient',
      );
    }
  }

  async findOneAndUpdate(id: number, update: UpdatePatientDto) {
    try {
      const patient = await this.patientRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!patient) {
        throw new BadRequestException('Patient not found');
      }

      return await this.patientRepository.save({
        id: id,
        ...update
      })
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch patient',
      );
    }
  }

  async assignDoctortoPatient(id: number, update: AssignDoctorDto) {
    try {
      const patient = await this.patientRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!patient) {
        throw new BadRequestException('Patient not found');
      }

      return await this.patientRepository.save({
        id: id,
        ...update
      })
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Assign doctor to Patient',
      );
    }
  }

  async getPatientCounts(user: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const totalPatients = await this.patientRepository.count({
      where: {
        hospitalId: user.hospitalId,
      }});

    const todayPatients = await this.patientRepository.count({
      where: {
        hospitalId: user.hospitalId,
        createdAt: Between(today, tomorrow),
      }});

    const visitedPatients = await this.appointmentRepository.count({
      where: {
        status: AppointmentStatus.COMPLETED,
        hospitalId: user.hospitalId,
      },
    });

    const unvisitedPatients = await this.appointmentRepository.count({
      where: {
        status: AppointmentStatus.SCHEDULED,
        hospitalId: user.hospitalId,
      },
    });
    return {
      totalPatients,
      todayPatients,
      visitedPatients,
      unvisitedPatients,
    };
  }
}
