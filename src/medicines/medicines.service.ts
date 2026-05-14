import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine, MedicineStatus } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicineListDto } from './dto/medicine-list.dto';
import * as XLSX from 'xlsx';

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

  async uploadExcel(file: Express.Multer.File) {
    try {
      // Read excel buffer
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });

      // First sheet
      const sheetName = workbook.SheetNames[0];

      // Sheet data
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const data = XLSX.utils.sheet_to_json(worksheet);

      for (const row of data as any[]) {
        // Find existing medicine
        const existingMedicine = await this.medicineRepo.findOne({
          where: {
            name: row.name,
            hospitalId: row.hospital_id,
          },
        });

        if (existingMedicine) {
          // Update existing row
          await this.medicineRepo.update(existingMedicine.id, {
            type: row.type,
            strength: row.strength,
            manufacturer: row.manufacturer,
            quantity: row.quantity,
            price: row.price,
            status: row.status,
            isActive: row.isActive,
            updatedAt: new Date(),
          });
        } else {
          // Create new row
          const medicine = this.medicineRepo.create({
            name: row.name,
            type: row.type,
            strength: row.strength,
            manufacturer: row.manufacturer,
            quantity: row.quantity,
            price: row.price,
            status: row.status,
            isActive: row.isActive,
            hospitalId: row.hospital_id,
            createdBy: row.created_by,
          });

          await this.medicineRepo.save(medicine);
        }
      }

      return {
        success: true,
        message: 'Excel uploaded successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
