import { Medicine } from 'src/medicines/entities/medicine.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Invoice } from '../../invoice/entities/invoice.entity';

@Entity('invoice_medicines')
export class InvoiceMedicine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  invoiceId: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.medicines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column()
  medicineId: number;

  @ManyToOne(() => Medicine)
  @JoinColumn({ name: 'medicineId' })
  medicine: Medicine;

  @Column()
  quantity: number;

  @Column({ length: 50 })
  strength: string;

  @Column({ length: 50 })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // per unit

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number; // price * quantity
}
