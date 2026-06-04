import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('prices')
  export class Price {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    hospitalId: number;
  
    @Column({ length: 100 })
    typeOfCharge: string;
  
    @Column('decimal', {
      precision: 10,
      scale: 2,
    })
    charge: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }