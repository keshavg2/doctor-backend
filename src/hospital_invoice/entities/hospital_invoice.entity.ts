// invoice.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { InvoiceItem } from '../../invoice-item/entities/invoice-item.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class HospitalInvoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'patient_id', type: 'int', nullable: true })
    patientId: number;

    @ManyToOne(() => Patient, { eager: false, nullable: true, onDelete: 'SET NULL', })
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;

    /* ---------------- Doctor ---------------- */
    @Column({ name: 'doctor_id', type: 'int', nullable: true })
    doctorId: number;

    @ManyToOne(() => Doctor, { eager: false, nullable: true, onDelete: 'SET NULL', })
    @JoinColumn({ name: 'doctor_id' })
    doctor: Doctor;

    @Column()
    type: string; // IPD / OPD

    @Column({ default: 0 })
    grandTotal: number;

    @Column({ nullable: true })
    remarks: string;

    @Column({ default: false })
    oxygenCharges: boolean;

    @OneToMany(() => InvoiceItem, (item) => item.invoice, {
        cascade: true,
        eager: true,
    })
    items: InvoiceItem[];

    @CreateDateColumn()
    createdAt: Date;
}