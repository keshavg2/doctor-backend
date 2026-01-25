import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('medicines')
  export class Medicine {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 150 })
    name: string;
  
    @Column({ length: 50 })
    type: string; 
    // tablet | syrup | injection | capsule | ointment
  
    @Column({ length: 50, nullable: true })
    strength: string;
    // 500mg | 10ml | etc.
  
    @Column({ length: 100, nullable: true })
    manufacturer: string;

    @Column({nullable:true})
    quantity: number;

    @Column({nullable: true})
    price: number;
  
    @Column({ default: true })
    isActive: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  