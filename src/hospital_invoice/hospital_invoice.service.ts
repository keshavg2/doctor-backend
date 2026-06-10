// invoice.service.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { HospitalInvoice } from './entities/hospital_invoice.entity';
import { InvoiceItem } from '../invoice-item/entities/invoice-item.entity';
import { CreateHospitalInvoiceDto } from './dto/create-hospital_invoice.dto';

import { Patient, PatientStatus } from '../patient/entities/patient.entity';
import { Doctor } from '../doctor/entities/doctor.entity';
import { User } from 'src/user/entities/user.entity';
import { Brackets } from 'typeorm';

@Injectable()
export class HospitalInvoiceService {
  constructor(
    @InjectRepository(HospitalInvoice)
    private readonly invoiceRepo: Repository<HospitalInvoice>,

    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepo: Repository<InvoiceItem>,

    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,

    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) { }

  async create(createInvoiceDto: CreateHospitalInvoiceDto, user: User) {
    const patient = await this.patientRepo.findOne({
      where: { id: createInvoiceDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const doctor = await this.doctorRepo.findOne({
      where: { id: createInvoiceDto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (patient) {
      this.patientRepo.save({ ...patient, status: PatientStatus.DISCHARGED })
    }

    let grandTotal = 0;

    const invoiceItems = createInvoiceDto.items.map((item) => {
      const amount = item.qty * item.rate;

      grandTotal += amount;

      return this.invoiceItemRepo.create({
        category: item.category,
        chargeName: item.chargeName,
        qty: item.qty,
        rate: item.rate,
        amount,
      });
    });

    if(createInvoiceDto.discount){
      grandTotal-=createInvoiceDto.discount
    }

    const invoice = this.invoiceRepo.create({
      patient,
      doctor,
      type: createInvoiceDto.type,
      remarks: createInvoiceDto.remarks,
      oxygenCharges: createInvoiceDto.oxygenCharges,
      grandTotal,
      items: invoiceItems,
      hospitalId: user.hospitalId
    });

    return await this.invoiceRepo.save(invoice);
  }

  // async findAll(page: number = 1, limit: number = 10, user: User, search: string | undefined) {
  //   const [data, total] = await this.invoiceRepo.findAndCount({
  //     where:{
  //       hospitalId: user.hospitalId
  //     },
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   });

  //   return {
  //     data,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }
  async findAll(
    page: number = 1,
    limit: number = 10,
    user: User,
    search?: string,
  ) {
    const queryBuilder = this.invoiceRepo
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.patient', 'patient')
      .leftJoinAndSelect('invoice.doctor', 'doctor')
      .leftJoinAndSelect('invoice.items', 'invoiceItem')
      .where('invoice.hospitalId = :hospitalId', {
        hospitalId: user.hospitalId,
      });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('patient.patientNumber LIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('patient.name LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('doctor.name LIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('invoice.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async getHospitalInvoiceStats(user: any) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      totalInvoices,
      todayInvoices,
      totalRevenueResult,
      todayRevenueResult,
    ] = await Promise.all([
      this.invoiceRepo.count({
        where: {
          hospitalId: user.hospitalId
        }
      }),

      this.invoiceRepo.count({
        where: {
          createdAt: Between(startOfToday, endOfToday),
          hospitalId: user.hospitalId
        },
      }),

      this.invoiceRepo
        .createQueryBuilder('invoice')
        .select('SUM(invoice.grandTotal)', 'total')
        .where('invoice.hospitalId = :hospitalId', {
          hospitalId: user.hospitalId,
        })
        .getRawOne(),

      this.invoiceRepo
        .createQueryBuilder('invoice')
        .select('SUM(invoice.grandTotal)', 'total')
        .where('invoice.hospitalId = :hospitalId', {
          hospitalId: user.hospitalId,
        })
        .andWhere('invoice.createdAt BETWEEN :start AND :end', {
          start: startOfToday,
          end: endOfToday,
        })
        .getRawOne(),
    ]);

    return {
      totalInvoices,
      todayInvoices,
      totalRevenue: Number(totalRevenueResult.total) || 0,
      todayRevenue: Number(todayRevenueResult.total) || 0,
    };
  }

  async update(
    id: number,
    updateInvoiceDto: Partial<CreateHospitalInvoiceDto>,
    user: any,
  ) {
    try {
      const invoice = await this.invoiceRepo.findOne({
        where: {
          id,
          hospitalId: user.hospitalId,
        },
      });
  
      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }
  
      Object.assign(invoice, updateInvoiceDto);

      const totalAmount =
      updateInvoiceDto.items?.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      ) ?? invoice.grandTotal;

    // Apply discount
    const discount =
      updateInvoiceDto.discount ?? invoice.discount ?? 0;

    // invoice.totalAmount = totalAmount;
    invoice.grandTotal = totalAmount - discount;
  
      return await this.invoiceRepo.save(invoice);
    } catch (error) {
      throw error;
    }
  }

  async remove(
    id: number,
    user: any,
  ) {
    try {
      const invoice = await this.invoiceRepo.findOne({
        where: {
          id,
          hospitalId: user.hospitalId,
        },
      });
  
      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }
  
      await this.invoiceRepo.remove(invoice);
  
      return {
        id,
      };
    } catch (error) {
      throw error;
    }
  }
}