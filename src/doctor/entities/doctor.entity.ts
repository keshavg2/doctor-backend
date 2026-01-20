import { Patient } from 'src/patient/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
  } from 'typeorm';
  
  @Entity('doctor')
  export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ name: 'hospital_name', length: 150, nullable:true })
    hospitalName: string;
  
    @Column({ length: 100, nullable:true })
    department: string;
  
    @Column({ length: 150, unique: true })
    email: string;
  
    @Column({ length: 15, unique: true })
    phone: string;
  
    @Column({ type: 'text', nullable:true })
    address: string;
  
    @Column({ length: 10, nullable:true })
    pincode: string;
  
    @Column({ length: 100, nullable:true })
    city: string;
  
    @Column({ length: 100, nullable:true })
    state: string;
  
    @Column({ length: 100, nullable:true })
    country: string;

    @OneToOne(() => User, (user) => user.patient)
    user: User;

    @OneToMany(() => Patient, (patient) => patient.doctors)
    patient: Patient;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  