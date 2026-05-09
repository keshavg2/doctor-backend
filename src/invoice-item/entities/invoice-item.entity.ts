// invoice-item.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { HospitalInvoice } from '../../hospital_invoice/entities/hospital_invoice.entity';
  
  @Entity()
  export class InvoiceItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => HospitalInvoice, (invoice) => invoice.items, {
      onDelete: 'CASCADE',
    })
    invoice: HospitalInvoice;
  
    @Column()
    category: string;
  
    @Column()
    chargeName: string;
  
    @Column()
    qty: number;
  
    @Column('decimal', {
      precision: 10,
      scale: 2,
    })
    rate: number;
  
    @Column('decimal', {
      precision: 10,
      scale: 2,
    })
    amount: number;
  }