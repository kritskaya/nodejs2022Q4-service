import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JWTPayload } from '../interfaces/jwt.payload.interface';
import { Request } from 'express';

export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_REFRESH_KEY,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JWTPayload) {
    const refreshToken = request.get('Authorization').replace('Bearer ', '');
    return {
      ...payload,
      refreshToken,
    };
  }
}
