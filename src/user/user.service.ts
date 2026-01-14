import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Doctor } from '../doctor/entities/doctor.entity';
import { Patient } from '../patient/entities/patient.entity';
import { Repository } from 'typeorm';
import { Role } from './enums/role.enum'

export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async createUser(data: Partial<User>) {
    const user = this.usersRepository.create(data);

    // save first to get user.id
    const savedUser = await this.usersRepository.save(user);

  // if role is DOCTOR
  if (data.role === Role.Doctor) {
    const doctor = this.doctorRepository.create({
      phone: data.phone,
      name: data.name,
      email: data.email
    });

    const savedDoctor = await this.doctorRepository.save(doctor);

    savedUser.doctorId = savedDoctor.id;
  }

  // if role is PATIENT
  if (data.role === Role.Patient) {
    const patient = this.patientRepository.create({
      phone: data.phone,
      name: data.name
    });

    const savedPatient = await this.patientRepository.save(patient);

    savedUser.patientId = savedPatient.id;
  }

  // update user with doctorId / patientId
  return this.usersRepository.save(savedUser);
  }

  findByPhone(phone: string) {
    return this.usersRepository.findOne({ where: { phone } });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findOne(id: number){
    return this.usersRepository.findOne({where: {id: id}});
  }

  findAll(){
    return this.usersRepository.find();
  }

  remove(id: number){
    const user =  this.usersRepository.findOne({where:{id:id}});
    return user;
  }
}