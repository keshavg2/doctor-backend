import { Injectable } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './entities/hospital.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepo: Repository<Hospital>,
  ) {}
  async create(hospitalName: string) {
    try{
      const hospital  =  await this.hospitalRepo.findOne({where: {
        name: hospitalName
      }})
      if(!hospital){
      const data = await this.hospitalRepo.save({
        name: hospitalName,   
      })
      return data;
     }
      console.log(hospital);
      return hospital;
    }
    catch(e){
      console.log('error', e);
      throw(e)
    }
  }

 
}
