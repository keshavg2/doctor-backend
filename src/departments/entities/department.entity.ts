import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('departments')
  export class Department {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    departmentName: string;
  
    @Column({ nullable: true })
    description: string;
  
    @Column({ default: true })
    isActive: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }