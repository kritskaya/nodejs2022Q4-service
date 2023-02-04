import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AlbumService } from 'src/albums/album.service';
import { ArtistService } from 'src/artists/artist.service';
import { TrackService } from 'src/tracks/track.service';
import { FavoritesRepsonse } from './dto/FavouritesResponse';
import { FavouritesService } from './favotites.service';
import { Favorites } from './interfaces/favourites.interface';

@Controller('favs')
export class FavouritesController {
  constructor(
    private favouritesService: FavouritesService,
    private trackService: TrackService,
    private artistService: ArtistService,
    private albumService: AlbumService,
  ) {}

  @Get()
  async findAll(): Promise<FavoritesRepsonse> {
    const favIds = this.favouritesService.findAll();

    const artists = favIds.artists.map((id) => this.artistService.findOne(id));
    const albums = favIds.albums.map((id) => this.albumService.findOne(id));
    const tracks = favIds.tracks.map((id) => this.trackService.findOne(id));
    
    return {
      artists,
      albums,
      tracks,
    };
  }

  @Post('track/:id')
  async addTrack(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<string> {
    const track = this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        'Track with specified id is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newFav = this.favouritesService.addTrack(id);
    return newFav;
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id', new ParseUUIDPipe()) id: string,) {
    const isFav = this.favouritesService.findTracks().includes(id);
    if (!isFav) {
      throw new HttpException(
        'Track with specified id is not in favourites',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.favouritesService.removeTrack(id);
    return;
  }

  @Post('album/:id')
  async addAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<string> {
    const album = this.albumService.findOne(id);
    if (!album) {
      throw new HttpException(
        'Album with specified id is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newFav = this.favouritesService.addAlbum(id);
    return newFav;
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id', new ParseUUIDPipe()) id: string,) {
    const isFav = this.favouritesService.findAlbums().includes(id);
    if (!isFav) {
      throw new HttpException(
        'Album with specified id is not in favourites',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.favouritesService.removeAlbum(id);
    return;
  }

  @Post('artist/:id')
  async addArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<string> {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newFav = this.favouritesService.addArtist(id);
    return newFav;
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id', new ParseUUIDPipe()) id: string,) {
    const isFav = this.favouritesService.findArtists().includes(id);
    if (!isFav) {
      throw new HttpException(
        'Artist with specified id is not in favourites',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.favouritesService.removeArtist(id);
    return;
  }
}
