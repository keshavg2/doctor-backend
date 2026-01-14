import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientListFilterDto } from './dto/patient-list-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    try {
      const {
        name,
        phone,
        address,
        city,
        state,
        country,
        pincode,
      } = createPatientDto;

      const patient = this.patientRepository.create({
        name,
        phone,
        address,
        city,
        state,
        country,
        pincode,
      });

      return await this.patientRepository.save(patient);
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to create patient',
      );
    }
  }

  async findAll(filter: PatientListFilterDto) {
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
}
