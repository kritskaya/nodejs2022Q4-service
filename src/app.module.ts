import { Module } from '@nestjs/common';
import { AlbumModule } from './albums/album.module';
import { ArtistModule } from './artists/artist.module';
import { FavoritesModule } from './favourites/favourites.module';
import { TrackModule } from './tracks/track.module';
import { UserModule } from './users/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    AlbumModule,
    ArtistModule,
    TrackModule,
    FavoritesModule,
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
