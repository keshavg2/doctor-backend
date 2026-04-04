import { Controller, Post, Body, BadRequestException, Get } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthService } from './auth.service';
import { privateDecrypt } from 'crypto';
import { HospitalService } from 'src/hospital/hospital.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly hospitalService: HospitalService
  ) {}

  @Post('signup')
  async signup(@Body() body: CreateAuthDto) {
    const existing = await this.userService.findByPhone(body.phone);
    if (existing) throw new BadRequestException('Email already registered');

    // console.log(body, 'body');
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const hospital =  await this.hospitalService.create(body.hospitalName)
    return this.userService.createUser({
      ...body,
      hospital: hospital,
      password: hashedPassword,
    });
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log('HI');
    const user = await this.userService.findByEmail(body.email);
    if (!user) throw new BadRequestException('Invalid email or password');

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid email or password');

    const token = await this.authService.generateToken(user);
    return { message: 'Login successful', access_token: token, user };
  }
}
