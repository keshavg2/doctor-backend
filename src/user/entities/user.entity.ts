import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {Role} from "../enums/role.enum"

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

  // Doctor ID (only if userType = doctor)
  @Column({ nullable: true })
  doctor_id?: number;

  // Patient ID (only if userType = patient)
  @Column({ nullable: true })
  patient_id?: number;

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
