import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Body, Delete, HttpCode, Post, Put } from '@nestjs/common/decorators';
import { ArtistService } from 'src/artists/artist.service';
import { AlbumService } from './album.service';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/album.dto';
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
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    const album = this.albumService.findOne(id);
    if (!album) {
      throw new HttpException(
        'Album with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  @Post()
  async create(
    @Body(ValidationPipe) createAlbumDTO: CreateAlbumDTO,
  ): Promise<Album> {
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateAlbumDTO: UpdateAlbumDTO,
  ): Promise<Album> {
    if (updateAlbumDTO.artistId) {
      const artist = this.artistService.findOne(updateAlbumDTO.artistId);
      if (!artist) {
        throw new HttpException(
          'Artist with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const album = this.albumService.findOne(id);
    if (!album) {
      throw new HttpException(
        'album with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedAlbum = this.albumService.update(id, updateAlbumDTO);
    return updatedAlbum;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const album = this.albumService.findOne(id);
    if (!album) {
      throw new HttpException(
        'album with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.albumService.delete(id);
    return;
  }
}
