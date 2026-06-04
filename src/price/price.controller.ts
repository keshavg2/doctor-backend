import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PriceService } from './price.service';
import { CreateMultiplePricingDto } from './dto/create-multiple-pricing.dto';

@Controller('price')
export class PriceController {
  constructor(private readonly pricingService: PriceService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() body: any,
    @Req() req: any,
  ) {
    try {
      const data = await this.pricingService.create(
        body,
        req.user,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Price created successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create price',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: any) {
    try {
      const data = await this.pricingService.findAll(req.user);

      return {
        statusCode: HttpStatus.OK,
        message: 'Prices fetched successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to fetch prices',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/bulk')
  async createBulk(
    @Body() body: CreateMultiplePricingDto,
    @Req() req: any,
  ) {
    try {
      const data = await this.pricingService.createBulk(
        body.charges,
        req.user,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Charges created successfully',
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create charges',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}