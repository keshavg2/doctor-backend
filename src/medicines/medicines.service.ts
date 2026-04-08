import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine, MedicineStatus } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicineListDto } from './dto/medicine-list.dto';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepo: Repository<Medicine>,
  ) { }

  /** CREATE */
  async create(createMedicineDto: CreateMedicineDto, user: any) {
    try {
      const medicine = this.medicineRepo.create({ ...createMedicineDto, createdBy: { id: user.userId }, hospitalId: user.hospitalId });
      return this.medicineRepo.save(medicine);
    } catch (e) {
      console.log('issue in creating the medicine', e)
      throw (e)
    }
  }

  /** LIST ALL */
  async findAll(page: number = 1, limit: number = 10, user: any) {
    try {
      const skip = (page - 1) * limit;

      const [medicines, total] = await this.medicineRepo.findAndCount({
        where: { isActive: true, hospitalId: user.hospitalId },
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });

      return {
        medicines,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (e) {
      console.log('Fetching the list of the medicine', e)
      throw (e)
    }
  }

  /** GET ONE */
  async findOne(id: number) {
    try {
      const medicine = await this.medicineRepo.findOne({
        where: { id },
      });

      if (!medicine) {
        throw new NotFoundException('Medicine not found');
      }

      return medicine;
    } catch (e) {
      console.log('throw error in find One api in medicine', e)
      throw (e)
    }
  }

  /** UPDATE */
  async update(id: number, updateMedicineDto: UpdateMedicineDto) {
    try {
      const medicine = await this.findOne(id);

      Object.assign(medicine, updateMedicineDto);
      return this.medicineRepo.save(medicine);
    } catch (e) {
      console.log('throw error in update api in medicine', e)
      throw (e)
    }
  }

  /** DELETE (Soft delete recommended) */
  async remove(id: number) {
    try {
      const medicine = await this.findOne(id);

      medicine.isActive = false;
      return this.medicineRepo.save(medicine);
    } catch (e) {
      console.log('Error in delting the medicine api', e)
      throw (e)
    }
  }

  async getCardCounts(user: any) {
    const totalMedicines = await this.medicineRepo.count({ where: { hospitalId: user.hospitalId } });

    const available = await this.medicineRepo.count({
      where: {
        status: MedicineStatus.AVAILABLE,
        hospitalId: user.hospitalId
      },
    });

    const lowStock = await this.medicineRepo.count({
      where: { status: MedicineStatus.LOW_STOCK, hospitalId: user.hospitalId },
    });

    const critical = await this.medicineRepo.count({
      where: { status: MedicineStatus.CRITICAL, hospitalId: user.hospitalId },
    });

    return {
      totalMedicines,
      available,
      lowStock,
      critical,
    };
  }
}
