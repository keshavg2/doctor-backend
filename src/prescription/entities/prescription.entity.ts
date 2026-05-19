// prescription.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Entity()
export class Prescription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    diagnosis: string;

    // ✅ JSONB column for medicines
    @Column({ type: 'jsonb' })
    medicines: {
        name: string;
        frequency: string;   // e.g. "2 times a day"
        type: string;        // e.g. "tablet", "syrup"
        days: number;
        totalQuantity: number;
    }[];

    @Column({ nullable: true })
    notes: string;

    // ✅ Prescription date (manual or default)
    @Column({ type: 'timestamp' })
    prescriptionDate: Date;

    // Optional: auto created timestamp
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'patient_id', type: 'int', nullable: true })
    patientId: number;

    @ManyToOne(() => Patient, { eager: false, nullable: true, onDelete: 'SET NULL', })
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;

    /* ---------------- Doctor ---------------- */
    @Column({ type: 'int', nullable: true })
    doctorId: number;

    @ManyToOne(() => Doctor, { eager: false, nullable: true, onDelete: 'SET NULL', })
    @JoinColumn({ name: 'doctor_id' })
    doctor: Doctor;

    @Column({ name: 'hospital_id', nullable: true })
    hospitalId: number;
}