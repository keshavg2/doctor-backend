import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MedicineStatus {
  AVAILABLE = 'available',
  LOW_STOCK = 'lowstock',
  CRITICAL = 'critical',
}

@Entity('medicines')
export class Medicine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 50 })
  type: string;

  @Column({ length: 50, nullable: true })
  strength: string;

  @Column({ length: 100, nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  price: number;

  @Column({
    type: 'enum',
    enum: MedicineStatus,
    default: MedicineStatus.AVAILABLE,
  })
  status: MedicineStatus;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}