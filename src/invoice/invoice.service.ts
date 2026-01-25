import { BadRequestException, Injectable } from '@nestjs/common';
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
  ){

  }
  create(createInvoiceDto: CreateInvoiceDto) {
    const { patientId, doctorId, medicines } = createInvoiceDto;

    if (!medicines || medicines.length === 0) {
      throw new BadRequestException('At least one medicine is required');
    }

    return this.dataSource.transaction(async (manager) => {
      /** ---------------- Calculate Total ---------------- */
      const totalPrice = medicines.reduce(
        (sum, med) => sum + med.price * med.quantity,
        0,
      );

      /** ---------------- Create Invoice ---------------- */
      const invoice = manager.create(Invoice, {
        patientId,
        doctorId,
        totalPrice,
        status: 'PAID',
      });

      const savedInvoice = await manager.save(invoice);

      /** ---------------- Create Invoice Medicines ---------------- */
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

      /** ---------------- Return Invoice with Medicines ---------------- */
      return manager.findOne(Invoice, {
        where: { id: savedInvoice.id },
        relations: ['medicines'],
      });
    });
  }

  findAll() {
    return `This action returns all invoice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
