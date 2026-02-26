import { Test, TestingModule } from '@nestjs/testing';
import { BedManagementService } from './bed_management.service';

describe('BedManagementService', () => {
  let service: BedManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BedManagementService],
    }).compile();

    service = module.get<BedManagementService>(BedManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
