import { Patient } from 'src/patient/entities/patient.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { InvoiceMedicine } from '../../invoice_medicines/entities/invoice_medicine.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  /** ---------------- Relations ---------------- */

  @Column()
  patientId: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  doctorId: number;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  /** ---------------- Invoice Details ---------------- */

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'varchar', length: 50, default: 'PAID' })
  status: string;
  // PAID | UNPAID | CANCELLED

  /** ---------------- Medicines ---------------- */

  @OneToMany(
    () => InvoiceMedicine,
    (invoiceMedicine) => invoiceMedicine.invoice,
    { cascade: true },
  )
  medicines: InvoiceMedicine[];

  /** ---------------- Timestamps ---------------- */

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
