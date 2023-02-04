import { Module } from '@nestjs/common';
import { AlbumModule } from './albums/album.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artists/artist.module';
import { FavoritesModule } from './favourites/favourites.module';
import { TrackModule } from './tracks/track.module';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';

@Module({
  imports: [AlbumModule, ArtistModule, TrackModule, FavoritesModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
