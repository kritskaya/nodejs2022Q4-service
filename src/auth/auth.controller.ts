import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { UserDTO } from '../users/dto/user.dto';
import { SignUpResponse } from './interfaces/signup.interface';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common/decorators';
import { RefreshTokenGuard } from '../common/guards/RefreshTokenGuard';
import { RefreshTokenDTO } from './dto/TokenDTO';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  @Post('refresh')
  async refreshAuthTokens(@Body() refreshTokenDTO: RefreshTokenDTO) {
    if (!refreshTokenDTO.refreshToken) {
      throw new HttpException(
        'invalid authetication data',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.authService.refreshAuthTokens(refreshTokenDTO.refreshToken);
  }
}
