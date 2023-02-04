import { forwardRef, Module } from '@nestjs/common';
import { ArtistModule } from 'src/artists/artist.module';
import { FavoritesModule } from 'src/favourites/favourites.module';
import { TrackModule } from 'src/tracks/track.module';
import { TrackService } from 'src/tracks/track.service';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [
    forwardRef(() => ArtistModule),
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
