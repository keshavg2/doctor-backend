import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('hospitals')
  export class Hospital {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 150 })
    name: string;
  
    @Column({ type: 'text', nullable: true })
    address: string;
  
    @Column({ length: 100, nullable: true })
    city: string;
  
    @Column({ length: 100, nullable: true })
    state: string;
  
    @Column({ length: 100, nullable: true })
    country: string;
  
    @Column({ length: 10, nullable: true })
    pincode: string;
  
    @Column({ default: true })
    active: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }