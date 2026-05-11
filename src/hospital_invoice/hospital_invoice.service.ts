// invoice.service.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HospitalInvoice } from './entities/hospital_invoice.entity';
import { InvoiceItem } from '../invoice-item/entities/invoice-item.entity';
import { CreateHospitalInvoiceDto } from './dto/create-hospital_invoice.dto';

import { Patient } from '../patient/entities/patient.entity';
import { Doctor } from '../doctor/entities/doctor.entity';
import { User } from 'src/user/entities/user.entity';

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
  ) {}

  async create(createInvoiceDto: CreateHospitalInvoiceDto) {
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

    const invoice = this.invoiceRepo.create({
      patient,
      doctor,
      type: createInvoiceDto.type,
      remarks: createInvoiceDto.remarks,
      oxygenCharges: createInvoiceDto.oxygenCharges,
      grandTotal,
      items: invoiceItems,
    });

    return await this.invoiceRepo.save(invoice);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.invoiceRepo.findAndCount({
      // where:{
      //   hospitalId: user.hospitalId
      // },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  
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
}