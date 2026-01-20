import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'india@123',
      database: 'doctor-backend',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PatientModule,
    DoctorModule,
  ],
})
export class AppModule {}
