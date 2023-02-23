import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../users/dto/user.dto';
import { UserService } from '../users/user.service';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';

const secret = process.env.JWT_SECRET_KEY;
const expiresIn = process.env.TOKEN_EXPIRE_TIME;

const refreshSecret = process.env.JWT_SECRET_REFRESH_KEY;
const refreshExpiresIn = process.env.TOKEN_REFRESH_EXPIRE_TIME;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDTO: UserDTO) {
    const user = await this.userService.findOneByUsername(createUserDTO.login);
    if (user) {
      throw new HttpException(
        'user with specified login already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await this.getHash(createUserDTO.password);

    const newUser = await this.userService.create({
      login: createUserDTO.login,
      password: passwordHash,
    });

    const tokens = await this.getTokens(newUser);
    await this.updateUserRefreshToken(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async login(authUserDTO: UserDTO) {
    const user = await this.userService.findOneByUsername(authUserDTO.login);
    if (!user) {
      throw new HttpException(
        'user with specified login not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordMatch = await argon2.verify(
      user.password,
      authUserDTO.password,
    );
    if (!passwordMatch) {
      throw new HttpException(
        'no user with such login and password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.getTokens(authUserDTO);
    await this.updateUserRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async getHash(value: string): Promise<string> {
    return argon2.hash(value);
  }

  async getTokens(user: Partial<User>) {
    const payload = { sub: user.id, login: user.login };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret,
        expiresIn,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    };
  }

  async updateUserRefreshToken(id: string, refreshToken: string) {
    const refreshTokenHash = await this.getHash(refreshToken);
    await this.userService.updateToken(id, refreshToken);
  }
}
