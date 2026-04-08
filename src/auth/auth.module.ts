import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { HospitalModule } from 'src/hospital/hospital.module';
import { HospitalService } from 'src/hospital/hospital.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { User } from 'src/user/entities/user.entity';


@Module({
  imports: [
    UserModule,
    HospitalModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([Hospital, User])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, HospitalService],
  exports: [JwtModule],
})
export class AuthModule {}
