import { Controller, Post, Body, BadRequestException, Get, HttpStatus, HttpException } from '@nestjs/common';
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
  ) { }

  @Post('signup')
  async signup(@Body() body: CreateAuthDto) {
    try {
      const existing = await this.userService.findByPhone(body.phone);
      if (existing) throw new BadRequestException('Email and phone Number already registered');

      const hashedPassword = await bcrypt.hash(body.password, 10);

      const hospital = await this.hospitalService.create(body.hospitalName)
      const data = await this.userService.createUser({
        ...body,
        hospital: hospital,
        password: hashedPassword,
      });
      console.log(data);
      return {
        statusCode: HttpStatus.OK,
        message: 'SignUp successfully',
        data,
      };
    } catch (e) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: e.message || 'Failed to SignUp successfully',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.userService.findByEmail(body.email);
      if (!user) throw new BadRequestException('Invalid email or password');

      const isMatch = await bcrypt.compare(body.password, user.password);
      if (!isMatch) throw new BadRequestException('Invalid email or password');

      const token = await this.authService.generateToken(user);
      return { message: 'Login successful', statusCode: HttpStatus.OK, access_token: token, user };
    }
    catch (e) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: e.message || 'Failed to Login successfully',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
