import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { UserDTO } from '../users/dto/user.dto';
import { SignUpResponse } from './interfaces/signup.interface';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { Get, Req, UseGuards } from '@nestjs/common/decorators';
import { RefreshTokenGuard } from '../guards/RefreshTokenGuard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(
    @Body(ValidationPipe) createUserDTO: UserDTO,
  ): Promise<SignUpResponse> {
    return this.authService.signUp(createUserDTO);
  }

  @Post('login')
  async login(@Body(ValidationPipe) authUserDTO: UserDTO) {
    return this.authService.login(authUserDTO);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshAuthTokens(@Req() request: Request) {
    const userId = request.user['sub'];
    const refreshToken = request.user['refreshToken'];
    return this.authService.refreshAuthTokens(userId, refreshToken);
  }
}
