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
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from '../albums/album.service';
import { ArtistService } from '../artists/artist.service';
import { AccessTokenGuard } from '../guards/AccessTokenGuard';
import { TrackService } from '../tracks/track.service';
import {
  CreateUpdateFavoriteResponse,
  FavoritesRepsonse,
} from './dto/FavouritesResponse';
import { FavouritesService } from './favotites.service';

@UseGuards(AccessTokenGuard)
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
    return await this.favouritesService.findAll();
  }

  @Post('track/:id')
  async addTrack(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CreateUpdateFavoriteResponse> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        'Track with specified id is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const message = await this.favouritesService.addTrack(id);
    return { message };
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    const isFav = (await this.favouritesService.findTracks()).includes(id);
    if (!isFav) {
      throw new HttpException(
        'Track with specified id is not in favourites',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.favouritesService.removeTrack(id);
    return;
  }

  @Post('album/:id')
  async addAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CreateUpdateFavoriteResponse> {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new HttpException(
        'Album with specified id is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const message = await this.favouritesService.addAlbum(id);
    return { message };
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    const isFav = (await this.favouritesService.findAlbums()).includes(id);
    if (!isFav) {
      throw new HttpException(
        'Album with specified id is not in favourites',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.favouritesService.removeAlbum(id);
    return;
  }

  @Post('artist/:id')
  async addArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CreateUpdateFavoriteResponse> {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const message = await this.favouritesService.addArtist(id);
    return { message };
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    const isFav = (await this.favouritesService.findArtists()).includes(id);
    if (!isFav) {
      throw new HttpException(
        'Artist with specified id is not in favourites',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.favouritesService.removeArtist(id);
    return;
  }
}
