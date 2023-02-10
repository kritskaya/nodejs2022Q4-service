import { Module } from '@nestjs/common';
import { AlbumModule } from './albums/album.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artists/artist.module';
import { DBModule } from './db/db.module';
import { FavoritesModule } from './favourites/favourites.module';
import { TrackModule } from './tracks/track.module';
import { UserModule } from './users/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    AlbumModule,
    ArtistModule,
    TrackModule,
    FavoritesModule,
    DBModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
