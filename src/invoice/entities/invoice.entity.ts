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
import { User } from 'src/user/entities/user.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  /** ---------------- Relations ---------------- */

  @Column({ nullable: true })
  patientId: number;

  @ManyToOne(() => Patient, { nullable: true, onDelete: 'SET NULL', })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ nullable: true })
  doctorId: number;

  @ManyToOne(() => Doctor, { nullable: true, onDelete: 'SET NULL', })
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
    { cascade: true, nullable: true },
  )
  medicines: InvoiceMedicine[];

  /** ---------------- Timestamps ---------------- */

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'hospital_id', nullable: true })
  hospitalId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
