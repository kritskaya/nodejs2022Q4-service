import { forwardRef, Module } from '@nestjs/common';
import { AlbumModule } from 'src/albums/album.module';
import { FavoritesModule } from 'src/favourites/favourites.module';
import { TrackModule } from 'src/tracks/track.module';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';

@Module({
  imports: [
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
