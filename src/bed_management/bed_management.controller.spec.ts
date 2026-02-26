import { Test, TestingModule } from '@nestjs/testing';
import { BedManagementController } from './bed_management.controller';
import { BedManagementService } from './bed_management.service';

describe('BedManagementController', () => {
  let controller: BedManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BedManagementController],
      providers: [BedManagementService],
    }).compile();

    controller = module.get<BedManagementController>(BedManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
