import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { CreateUserDTO } from '../users/dto/user.dto';
import { SignUpResponse } from '../users/interfaces/signup.interface';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('signup')
  async signup(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<SignUpResponse> {
    const user = await this.userService.findOneByUsername(createUserDTO.login);
    if (user) {
      throw new HttpException(
        'user with specified login already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    
    return this.authService.sighUp(createUserDTO);
  }
}
