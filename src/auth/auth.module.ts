import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const secret = process.env.JWT_SECRET_KEY;
const expiresIn = process.env.TOKEN_EXPIRE_TIME;

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret,
      signOptions: {
        expiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
