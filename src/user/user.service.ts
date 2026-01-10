import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  createUser(data: Partial<User>) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
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