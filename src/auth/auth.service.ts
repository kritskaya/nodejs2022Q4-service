import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../users/dto/user.dto';
import { UserService } from '../users/user.service';
import * as argon2 from 'argon2';
import { JWTPayload } from './interfaces/jwt.payload.interface';

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
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash = await this.getHash(createUserDTO.password);

    const newUser = await this.userService.create({
      login: createUserDTO.login,
      password: passwordHash,
    });

    const tokens = await this.getTokens(newUser.id, newUser.login);
    await this.updateUserRefreshToken(newUser.id, tokens.refreshToken);

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

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateUserRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getHash(value: string): Promise<string> {
    return argon2.hash(value);
  }

  async getTokens(userId: string, login: string) {
    const payload: JWTPayload = { sub: userId, login: login };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret,
        expiresIn,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    };
  }

  async updateUserRefreshToken(id: string, refreshToken: string) {
    const refreshTokenHash = await this.getHash(refreshToken);
    await this.userService.updateToken(id, refreshTokenHash);
  }

  async refreshAuthTokens(refreshToken: string) {
    const { sub: userId } = await this.jwtService.verifyAsync(refreshToken, {
      secret: refreshSecret,
    });

    if (!userId) {
      throw new HttpException('invalid token', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new HttpException(
        'user with specified id not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const refreshTokenMatch = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatch) {
      throw new HttpException(
        'invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateUserRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
