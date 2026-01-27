import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BedManagement } from './entities/bed_management.entity';
import { CreateBedManagementDto } from './dto/create-bed_management.dto';
import { UpdateBedManagementDto } from './dto/update-bed_management.dto';

@Injectable()
export class BedManagementService {
  constructor(
    @InjectRepository(BedManagement)
    private readonly bedRepository: Repository<BedManagement>,
  ) {}

  // CREATE
  async create(
    createBedManagementDto: CreateBedManagementDto,
  ): Promise<BedManagement> {
    try {
      const bed = this.bedRepository.create(createBedManagementDto);
      return await this.bedRepository.save(bed);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to create bed',
      );
    }
  }

  // FIND ALL
  async findAll(): Promise<BedManagement[]> {
    try {
      return await this.bedRepository.find();
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to fetch beds',
      );
    }
  }

  // FIND ONE
  async findOne(id: number): Promise<BedManagement> {
    try {
      const bed = await this.bedRepository.findOne({
        where: { id },
      });

      if (!bed) {
        throw new NotFoundException('Bed not found');
      }

      return bed;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException(
            error.message || 'Failed to fetch bed',
          );
    }
  }

  // UPDATE
  async update(
    id: number,
    updateBedManagementDto: UpdateBedManagementDto,
  ): Promise<BedManagement> {
    try {
      const bed = await this.findOne(id);

      const updatedBed = this.bedRepository.merge(
        bed,
        updateBedManagementDto,
      );

      return await this.bedRepository.save(updatedBed);
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException(
            error.message || 'Failed to update bed',
          );
    }
  }

  // DELETE
  async remove(id: number): Promise<void> {
    try {
      const bed = await this.findOne(id);
      await this.bedRepository.remove(bed);
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException(
            error.message || 'Failed to delete bed',
          );
    }
  }
}
