import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  
  export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
  }
  
  export enum AppointmentType {
    CONSULTATION = 'consultation',
    FOLLOW_UP = 'follow_up',
    EMERGENCY = 'emergency',
  }
  
  @Entity('appointments')
  export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'int' })
    patientId: number;

    @ManyToOne(() => Patient, { eager: false })
    @JoinColumn({ name: 'patientId' })
    patient: User;

    /* ---------------- Doctor ---------------- */
    @Column({ type: 'int' })
    doctorId: number;

    @ManyToOne(() => Doctor, { eager: false })
    @JoinColumn({ name: 'doctorId' })
    doctor: User;
  
    @Column({ type: 'timestamp' })
    appointmentDate: Date;
  
    @Column({
      type: 'enum',
      enum: AppointmentType,
      default: AppointmentType.CONSULTATION,
    })
    type: AppointmentType;
  
    @Column({
      type: 'enum',
      enum: AppointmentStatus,
      default: AppointmentStatus.SCHEDULED,
    })
    status: AppointmentStatus;
  
    @Column({ type: 'text', nullable: true })
    notes?: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  }
  