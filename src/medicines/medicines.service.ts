import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicineListDto } from './dto/medicine-list.dto';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepo: Repository<Medicine>,
  ) {}

  /** CREATE */
  async create(createMedicineDto: CreateMedicineDto) {
    try{
    const medicine = this.medicineRepo.create(createMedicineDto);
    return this.medicineRepo.save(medicine);
    }catch(e){
      console.log('issue in creating the medicine', e)
      throw(e)
    }
  }

  /** LIST ALL */
  async findAll() {
    try{
    return this.medicineRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }catch(e){
    console.log('Fetching the list of the medicine', e)
    throw(e)
  }
  }

  /** GET ONE */
  async findOne(id: number) {
    try{
    const medicine = await this.medicineRepo.findOne({
      where: { id },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    return medicine;
  }catch(e){
    console.log('throw error in find One api in medicine', e)
    throw(e)
  }
  }

  /** UPDATE */
  async update(id: number, updateMedicineDto: UpdateMedicineDto) {
    try{
    const medicine = await this.findOne(id);

    Object.assign(medicine, updateMedicineDto);
    return this.medicineRepo.save(medicine);
  }catch(e){
    console.log('throw error in update api in medicine', e)
    throw(e)
  }
  }

  /** DELETE (Soft delete recommended) */
  async remove(id: number) {
    try{ 
    const medicine = await this.findOne(id);

    medicine.isActive = false;
    return this.medicineRepo.save(medicine);
  }catch(e){
    console.log('Error in delting the medicine api', e)
    throw(e)
  }
  }
}
