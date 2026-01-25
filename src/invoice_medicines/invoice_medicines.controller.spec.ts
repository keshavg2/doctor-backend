import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceMedicinesController } from './invoice_medicines.controller';
import { InvoiceMedicinesService } from './invoice_medicines.service';

describe('InvoiceMedicinesController', () => {
  let controller: InvoiceMedicinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceMedicinesController],
      providers: [InvoiceMedicinesService],
    }).compile();

    controller = module.get<InvoiceMedicinesController>(InvoiceMedicinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
