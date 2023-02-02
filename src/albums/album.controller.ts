import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Body, Delete, HttpCode, Post, Put } from '@nestjs/common/decorators';
import { ArtistService } from 'src/artists/artist.service';
import { validate } from 'uuid';
import { AlbumService } from './album.service';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';
import { Album } from './interfaces/album.interface';

@Controller('album')
export class AlbumController {
  constructor(
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  @Get()
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params): Promise<Album> {
    if (!validate(params.id)) {
      throw new HttpException(
        'Specified id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const album = this.albumService.findOne(params.id);
    if (!album) {
      throw new HttpException(
        'Album with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  @Post()
  async create(@Body() createAlbumDTO: CreateAlbumDTO): Promise<Album> {
    if (
      typeof createAlbumDTO.name !== 'string' ||
      typeof createAlbumDTO.year !== 'number' ||
      (typeof createAlbumDTO.artistId !== 'string' &&
        createAlbumDTO.artistId !== null)
    ) {
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }

    if (createAlbumDTO.artistId && !validate(createAlbumDTO.artistId)) {
      throw new HttpException(
        'Specified id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createAlbumDTO.artistId) {
      const artist = this.artistService.findOne(createAlbumDTO.artistId);
      if (!artist) {
        throw new HttpException(
          'Artist with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const newAlbum = this.albumService.create(createAlbumDTO);
    return newAlbum;
  }

  @Put(':id')
  async update(
    @Param() params,
    @Body() updateAlbumDTO: UpdateAlbumDTO,
  ): Promise<Album> {
    if (!validate(params.id)) {
      throw new HttpException(
        'Specified id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateAlbumDTO.artistId && !validate(updateAlbumDTO.artistId)) {
      throw new HttpException(
        'Specified artist id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      (updateAlbumDTO.name && typeof updateAlbumDTO.name !== 'string') ||
      (updateAlbumDTO.year && typeof updateAlbumDTO.year !== 'number') ||
      (Object.hasOwnProperty('artistId') &&
        typeof updateAlbumDTO.artistId !== 'string' &&
        updateAlbumDTO.artistId !== null)
    ) {
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }

    if (updateAlbumDTO.artistId) {
      const artist = this.artistService.findOne(updateAlbumDTO.artistId);
      if (!artist) {
        throw new HttpException(
          'Artist with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const album = this.albumService.findOne(params.id);
    if (!album) {
      throw new HttpException(
        'album with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedAlbum = this.albumService.update(params.id, updateAlbumDTO);
    return updatedAlbum;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() params) {
    if (!validate(params.id)) {
      throw new HttpException(
        'Specified id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const album = this.albumService.findOne(params.id);
    if (!album) {
      throw new HttpException(
        'album with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.albumService.delete(params.id);
    return;
  }
}
