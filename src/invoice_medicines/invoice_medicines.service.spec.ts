import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceMedicinesService } from './invoice_medicines.service';

describe('InvoiceMedicinesService', () => {
  let service: InvoiceMedicinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceMedicinesService],
    }).compile();

    service = module.get<InvoiceMedicinesService>(InvoiceMedicinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
