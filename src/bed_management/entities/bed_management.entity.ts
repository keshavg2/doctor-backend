import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { Patient } from 'src/patient/entities/patient.entity';
  
  export enum BedStatus {
    AVAILABLE = 'available',
    OCCUPIED = 'occupied',
    MAINTENANCE = 'maintenance',
  }
  
  @Entity('beds')
  export class BedManagement {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 50 })
    bedNumber: string;
  
    @Column({ type: 'varchar', length: 100 })
    ward: string;
  
    @Column({ type: 'varchar', length: 50 })
    bedType: string; // ICU, General, Private
  
    @Column({
      type: 'enum',
      enum: BedStatus,
      default: BedStatus.AVAILABLE,
    })
    status: BedStatus;
  
    /* ---------- Patient (optional) ---------- */
    @Column({ type: 'int', nullable: true })
    patientId?: number;
  
    @ManyToOne(() => Patient, { nullable: true })
    @JoinColumn({ name: 'patientId' })
    patient?: Patient;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  