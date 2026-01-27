import { Module } from '@nestjs/common';
import { BedManagementService } from './bed_management.service';
import { BedManagementController } from './bed_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BedManagement } from './entities/bed_management.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BedManagement])],
  controllers: [BedManagementController],
  providers: [BedManagementService],
})
export class BedManagementModule {}
