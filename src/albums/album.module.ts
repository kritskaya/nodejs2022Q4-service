import { forwardRef, Module } from '@nestjs/common';
import { ArtistModule } from '../artists/artist.module';
import { FavoritesModule } from '../favourites/favourites.module';
import { TrackModule } from '../tracks/track.module';
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
