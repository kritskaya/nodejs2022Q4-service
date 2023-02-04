import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { AlbumService } from 'src/albums/album.service';
import { CreateArtistDTO, UpdateArtistDTO } from 'src/artists/dto/artist.dto';
import { FavouritesService } from 'src/favourites/favotites.service';
import { TrackService } from 'src/tracks/track.service';
import { ArtistService } from './artist.service';
import { Artist } from './interfaces/artist.interface';

@Controller('artist')
export class ArtistController {
  constructor(
    private artistService: ArtistService,
    private albumService: AlbumService,
    private trackService: TrackService,
    private favsService: FavouritesService,
  ) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    const artists = this.artistService.findAll();
    return artists;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Artist> {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return artist;
  }

  @Post()
  async create(
    @Body(ValidationPipe) createArtistDTO: CreateArtistDTO,
  ): Promise<Artist> {
    const newArtist = this.artistService.create(createArtistDTO);
    return newArtist;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateArtistDTO: UpdateArtistDTO,
  ): Promise<Artist> {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const newArtist = this.artistService.update(id, updateArtistDTO);
    return newArtist;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.artistService.delete(id);

    const albums = this.albumService.findAll();
    albums.forEach((album) => {
      if (album.artistId === id) {
        this.albumService.update(album.id, { artistId: null });
      }
    });

    const tracks = this.trackService.findAll();
    tracks.forEach((track) => {
      if (track.artistId === id) {
        this.trackService.update(track.id, { artistId: null });
      }
    });

    const favs = this.favsService.findArtists();
    const isFav = favs.includes(id);
    if (isFav) {
      this.favsService.removeArtist(id);
    }

    return;
  }
}
