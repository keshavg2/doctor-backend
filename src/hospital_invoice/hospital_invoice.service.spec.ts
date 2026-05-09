import { Test, TestingModule } from '@nestjs/testing';
import { HospitalInvoiceService } from './hospital_invoice.service';

describe('HospitalInvoiceService', () => {
  let service: HospitalInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalInvoiceService],
    }).compile();

    service = module.get<HospitalInvoiceService>(HospitalInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
