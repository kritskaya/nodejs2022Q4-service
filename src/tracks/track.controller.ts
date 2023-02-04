import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { AlbumService } from 'src/albums/album.service';
import { ArtistService } from 'src/artists/artist.service';
import { FavouritesService } from 'src/favourites/favotites.service';
import { CreateTrackDTO, UpdateTrackDTO } from './dto/track.dto';
import { Track } from './interfaces/track.interface';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(
    private trackService: TrackService,
    private albumService: AlbumService,
    private artistService: ArtistService,
    private favsService: FavouritesService,
  ) {}

  @Get()
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    const track = this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        'Track with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return track;
  }

  @Post()
  async create(@Body(ValidationPipe) dto: CreateTrackDTO): Promise<Track> {
    if (dto.albumId) {
      const album = this.albumService.findOne(dto.albumId);
      if (!album) {
        throw new HttpException(
          'Album with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.artistId) {
      const artist = this.artistService.findOne(dto.artistId);
      if (!artist) {
        throw new HttpException(
          'Artist with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const newTrack = this.trackService.create(dto);
    return newTrack;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) dto: UpdateTrackDTO,
  ): Promise<Track> {
    const track = this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        'Track with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (dto.albumId) {
      const album = this.albumService.findOne(dto.albumId);
      if (!album) {
        throw new HttpException(
          'Album with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.artistId) {
      const artist = this.artistService.findOne(dto.artistId);
      if (!artist) {
        throw new HttpException(
          'Artist with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const updatedTrack = this.trackService.update(id, dto);
    return updatedTrack;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const track = this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        'Track with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.trackService.delete(id);

    const favs = this.favsService.findTracks();
    const isFav = favs.includes(id);
    if (isFav) {
      this.favsService.removeTrack(id);
    }

    return;
  }
}
