import { Module } from '@nestjs/common';
import { InvoiceMedicinesService } from './invoice_medicines.service';
import { InvoiceMedicinesController } from './invoice_medicines.controller';

@Module({
  controllers: [InvoiceMedicinesController],
  providers: [InvoiceMedicinesService],
})
export class InvoiceMedicinesModule {}
