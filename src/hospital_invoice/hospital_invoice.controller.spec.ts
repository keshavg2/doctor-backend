import { Test, TestingModule } from '@nestjs/testing';
import { HospitalInvoiceController } from './hospital_invoice.controller';
import { HospitalInvoiceService } from './hospital_invoice.service';

describe('HospitalInvoiceController', () => {
  let controller: HospitalInvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalInvoiceController],
      providers: [HospitalInvoiceService],
    }).compile();

    controller = module.get<HospitalInvoiceController>(HospitalInvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
