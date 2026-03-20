import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { DataSource, Repository } from 'typeorm';
import { InvoiceMedicine } from 'src/invoice_medicines/entities/invoice_medicine.entity';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,

    @InjectRepository(InvoiceMedicine)
    private readonly invoiceMedicineRepo: Repository<InvoiceMedicine>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { patientId, doctorId, medicines } = createInvoiceDto;

    if (!medicines || medicines.length === 0) {
      throw new BadRequestException('At least one medicine is required');
    }

    return await this.dataSource.transaction(async (manager) => {
      const totalPrice = medicines.reduce(
        (sum, med) => sum + med.price * med.quantity,
        0,
      );

      const invoice = manager.create(Invoice, {
        patientId,
        doctorId,
        totalPrice,
        status: 'PAID',
      });

      const savedInvoice = await manager.save(invoice);

      const invoiceMedicines = medicines.map((med) =>
        manager.create(InvoiceMedicine, {
          invoiceId: savedInvoice.id,
          medicineId: med.medicineId,
          quantity: med.quantity,
          strength: med.strength,
          type: med.type,
          price: med.price,
          subtotal: med.price * med.quantity,
        }),
      );

      await manager.save(invoiceMedicines);

      return await manager.findOne(Invoice, {
        where: { id: savedInvoice.id },
        relations: ['medicines'],
      });
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [invoices, total] = await this.invoiceRepo.findAndCount({
        relations: ['medicines'],
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });
  
      return {
        invoices,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const invoice = await this.invoiceRepo.findOne({
        where: { id },
        relations: ['medicines'],
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      return invoice;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
      relations: ['medicines'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return await this.dataSource.transaction(async (manager) => {
      const { medicines } = updateInvoiceDto;

      if (medicines && medicines.length > 0) {
        await manager.delete(InvoiceMedicine, { invoiceId: id });

        const updatedMedicines = medicines.map((med) =>
          manager.create(InvoiceMedicine, {
            invoiceId: id,
            medicineId: med.medicineId,
            quantity: med.quantity,
            strength: med.strength,
            type: med.type,
            price: med.price,
            subtotal: med.price * med.quantity,
          }),
        );

        await manager.save(updatedMedicines);

        invoice.totalPrice = medicines.reduce(
          (sum, med) => sum + med.price * med.quantity,
          0,
        );
      }

      if (updateInvoiceDto.patientId) {
        invoice.patientId = updateInvoiceDto.patientId;
      }

      if (updateInvoiceDto.doctorId) {
        invoice.doctorId = updateInvoiceDto.doctorId;
      }

      await manager.save(invoice);

      return await manager.findOne(Invoice, {
        where: { id },
        relations: ['medicines'],
      });
    });
  }

  async remove(id: number) {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return await this.dataSource.transaction(async (manager) => {
      await manager.delete(InvoiceMedicine, { invoiceId: id });
      await manager.delete(Invoice, { id });

      return {
        message: 'Invoice deleted successfully',
      };
    });
  }
}