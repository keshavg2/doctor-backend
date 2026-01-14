import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Doctor} from '../doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Doctor, Patient])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
