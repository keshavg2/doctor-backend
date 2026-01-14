import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import {Role} from "../enums/role.enum"
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // Name
  @Column({ nullable: true })
  name?: string;

  // Email
  @Index({ unique: true })
  @Column({ nullable: true })
  email?: string;

  // Phone
  @Index({ unique: true })
  @Column({ nullable: true })
  phone?: string;

  // Password
  @Column()
  password: string;

  // OTP (for verification / login)
  @Column({ nullable: true })
  otp?: string;

  @RelationId((user: User) => user.doctor)
  doctorId: number;

  @RelationId((user: User) => user.patient)
  patientId: number;

  // Doctor ID (only if userType = doctor)
  @OneToOne(() => Doctor, (doctor) => doctor.user, { nullable: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  // Patient ID (only if userType = patient)
  @OneToOne(() => Patient, (patient) => patient.user, { nullable: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
