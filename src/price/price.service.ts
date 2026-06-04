import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { CreatePriceDto } from './dto/create-price.dto';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly pricingRepo: Repository<Price>,
  ) {}

  async create(createPricingDto: CreatePriceDto, user: any) {
    try {
      const pricing = this.pricingRepo.create({
        ...createPricingDto,
        hospitalId: user.hospitalId,
      });

      return await this.pricingRepo.save(pricing);
    } catch (error) {
      console.error('Create Price Error:', error);

      throw new BadRequestException(
        error.message || 'Failed to create price',
      );
    }
  }

  async findAll(user: any) {
    try {
      return await this.pricingRepo.find({
        where: {
          hospitalId: user.hospitalId,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      console.error('Fetch Prices Error:', error);

      throw new BadRequestException(
        error.message || 'Failed to fetch prices',
      );
    }
  }

  async createBulk(
    charges: CreatePriceDto[],
    user: any,
  ) {
    try {
      const pricingData = charges.map((item) =>
        this.pricingRepo.create({
          ...item,
          hospitalId: user.hospitalId,
        }),
      );

      return await this.pricingRepo.save(pricingData);
    } catch (error) {
      console.error('Create Bulk Prices Error:', error);

      throw new BadRequestException(
        error.message || 'Failed to create charges',
      );
    }
  }
}