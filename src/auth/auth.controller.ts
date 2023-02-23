import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { UserDTO } from '../users/dto/user.dto';
import { SignUpResponse } from '../users/interfaces/signup.interface';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
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
}
