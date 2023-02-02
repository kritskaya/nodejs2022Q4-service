import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistController } from './artists/artist.controller';
import { ArtistService } from './artists/artist.service';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, ArtistController],
  providers: [AppService, UserService, ArtistService],
})
export class AppModule {}
