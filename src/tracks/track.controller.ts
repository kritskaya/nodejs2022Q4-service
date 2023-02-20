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
import { CreateTrackDTO, UpdateTrackDTO } from './dto/track.dto';
import { Track } from '@prisma/client';
import { TrackService } from './track.service';
import { AlbumService } from '../albums/album.service';
import { ArtistService } from '../artists/artist.service';

@Controller('track')
export class TrackController {
  constructor(
    private trackService: TrackService,
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  @Get()
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        'Track with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return track;
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) dto: CreateTrackDTO,
  ): Promise<Track> {
    if (dto.albumId) {
      const album = await this.albumService.findOne(dto.albumId);
      if (!album) {
        throw new HttpException(
          'Album with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.artistId) {
      const artist = await this.artistService.findOne(dto.artistId);
      if (!artist) {
        throw new HttpException(
          'Artist with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const newTrack = await this.trackService.create(dto);
    return newTrack;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) dto: UpdateTrackDTO,
  ): Promise<Track> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        'Track with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (dto.albumId) {
      const album = await this.albumService.findOne(dto.albumId);
      if (!album) {
        throw new HttpException(
          'Album with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.artistId) {
      const artist = await this.artistService.findOne(dto.artistId);
      if (!artist) {
        throw new HttpException(
          'Artist with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const updatedTrack = await this.trackService.update(id, dto);
    return updatedTrack;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        'Track with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.trackService.delete(id);
    return;
  }
}
