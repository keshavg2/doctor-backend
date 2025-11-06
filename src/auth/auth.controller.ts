import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: { email: string; password: string; name?: string }) {
    const existing = await this.userService.findByEmail(body.email);
    if (existing) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(body.password, 10);
    return this.userService.createUser({
      ...body,
      password: hashedPassword,
    });
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) throw new BadRequestException('Invalid email or password');

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid email or password');

    return { message: 'Login successful', user };
  }
}
