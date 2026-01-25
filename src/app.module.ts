import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { MedicinesModule } from './medicines/medicines.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceMedicinesModule } from './invoice_medicines/invoice_medicines.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'doctor-backend',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PatientModule,
    DoctorModule,
    MedicinesModule,
    InvoiceModule,
    InvoiceMedicinesModule,
  ],
})
export class AppModule {}
