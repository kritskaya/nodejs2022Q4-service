import { Module, forwardRef } from '@nestjs/common';
import { AlbumModule } from 'src/albums/album.module';
import { ArtistModule } from 'src/artists/artist.module';
import { TrackModule } from 'src/tracks/track.module';
import { FavouritesService } from './favotites.service';
import { FavouritesController } from './favourites.controller';

@Module({
  imports: [
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [FavouritesController],
  providers: [FavouritesService],
  exports: [FavouritesService],
})
export class FavoritesModule {}
