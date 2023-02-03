import { Module } from '@nestjs/common';
import { AlbumModule } from 'src/albums/album.module';
import { ArtistModule } from 'src/artists/artist.module';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [ArtistModule, AlbumModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
