import { Doctor } from 'src/doctor/entities/doctor.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  
  @Entity('patients')
  export class Patient {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ length: 15 })
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

    @Column({name: 'doctor_id', nullable: true})
    doctorId: number;

    @ManyToOne(() => Doctor, (doctor) => doctor.patient, {
      onDelete: 'CASCADE',
      nullable: true
    })
    @JoinColumn({ name: 'doctorId' })
    doctors: Doctor;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  