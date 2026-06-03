// prescription.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prescription } from './entities/prescription.entity';
import { Brackets, Repository } from 'typeorm';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient, PatientStatus } from 'src/patient/entities/patient.entity';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepo: Repository<Prescription>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) { }

  async create(dto: CreatePrescriptionDto, user: any) {
    try {
      const doctor = await this.doctorRepo.findOneBy({ id: dto.doctorId });
      const patient = await this.patientRepo.findOneBy({ id: dto.patientId });

      if (!doctor) throw new NotFoundException('Doctor not found');
      if (!patient) throw new NotFoundException('Patient not found');

      const prescription = this.prescriptionRepo.create({
        diagnosis: dto.diagnosis,
        medicines: dto.medicines,
        notes: dto.notes,
        prescriptionDate: new Date(dto.prescriptionDate),
        doctor,
        patient,
        doctorId: dto.doctorId,
        patientId: dto.patientId,
        hospitalId: user.hospitalId,
      });

      if (patient) {
        this.patientRepo.save({ ...patient, status: PatientStatus.UNDER_OBSERVATION })
      }

      return await this.prescriptionRepo.save(prescription);
    } catch (error) {
      console.error('Create Prescription Error:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  // async findAll(user: any) {
  //   try {
  //     return await this.prescriptionRepo.find({
  //       where: {hospitalId: user.hospitalId},
  //       relations: ['doctor', 'patient'],
  //       order: { id: 'DESC' },
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  async findAll(
    user: any,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    try {
      const queryBuilder = this.prescriptionRepo
        .createQueryBuilder('prescription')
        .leftJoinAndSelect('prescription.doctor', 'doctor')
        .leftJoinAndSelect('prescription.patient', 'patient')
        .where('prescription.hospitalId = :hospitalId', {
          hospitalId: user.hospitalId,
        });

      if (search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('patient.name LIKE :search', {
              search: `%${search}%`,
            })
              .orWhere('patient.patientNumber LIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('doctor.name LIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('CAST(prescription.id AS CHAR) LIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
      }

      const [data, total] = await queryBuilder
        .orderBy('prescription.id', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prescriptionRepo.findOne({
        where: { id },
        relations: ['doctor', 'patient'],
      });

      if (!data) {
        throw new NotFoundException('Prescription not found');
      }

      return data;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, dto: UpdatePrescriptionDto) {
    try {
      const prescription = await this.findOne(id);

      if (dto.doctorId) {
        const doctor = await this.doctorRepo.findOneBy({ id: dto.doctorId });
        if (!doctor) throw new NotFoundException('Doctor not found');
        // prescription.doctor = doctor;
        prescription.doctorId = dto.doctorId;
      }

      if (dto.patientId) {
        const patient = await this.patientRepo.findOneBy({ id: dto.patientId });
        if (!patient) throw new NotFoundException('Patient not found');
        // prescription.patient = patient;
        prescription.patientId = dto.patientId;
      }

      Object.assign(prescription, {
        diagnosis: dto.diagnosis ?? prescription.diagnosis,
        medicines: dto.medicines ?? prescription.medicines,
        notes: dto.notes ?? prescription.notes,
        prescriptionDate: dto.prescriptionDate
          ? new Date(dto.prescriptionDate)
          : prescription.prescriptionDate,
      });

      return await this.prescriptionRepo.save(prescription);
    } catch (error) {
      console.error('Update Error:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const prescription = await this.findOne(id);
      await this.prescriptionRepo.remove(prescription);

      return { message: 'Prescription deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}