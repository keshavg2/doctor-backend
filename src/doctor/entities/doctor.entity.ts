import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
  } from 'typeorm';
  
  @Entity('docotor')
  export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ name: 'hospital_name', length: 150 })
    hospitalName: string;
  
    @Column({ length: 100 })
    department: string;
  
    @Column({ length: 150, unique: true })
    email: string;
  
    @Column({ length: 15, unique: true })
    phone: string;
  
    @Column({ type: 'text' })
    address: string;
  
    @Column({ length: 10 })
    pincode: string;
  
    @Column({ length: 100 })
    city: string;
  
    @Column({ length: 100 })
    state: string;
  
    @Column({ length: 100 })
    country: string;

    @OneToOne(() => User, (user) => user.patient)
    user: User;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  