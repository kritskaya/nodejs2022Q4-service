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
} from '@nestjs/common';
import { CreateArtistDTO } from 'src/artists/dto/create-artist.dto';
import { validate } from 'uuid';
import { ArtistService } from './artist.service';
import { UpdateArtistDTO } from './dto/update-artist.dto';
import { Artist } from './interfaces/artist.interface';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    const artists = this.artistService.findAll();
    return artists;
  }

  @Get(':id')
  async findOne(@Param() params): Promise<Artist> {
    if (!validate(params.id)) {
      throw new HttpException(
        'Specified id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const artist = this.artistService.findOne(params.id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return artist;
  }

  @Post()
  async create(@Body() createArtistDTO: CreateArtistDTO): Promise<Artist> {
    if (
      typeof createArtistDTO.name !== 'string' ||
      typeof createArtistDTO.grammy !== 'boolean'
    ) {
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }

    const newArtist = this.artistService.create(createArtistDTO);
    return newArtist;
  }

  @Put(':id')
  async update(
    @Param() params,
    @Body() updateArtistDTO: UpdateArtistDTO,
  ): Promise<Artist> {
    if (!validate(params.id)) {
      throw new HttpException(
        'Specified id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof updateArtistDTO.grammy !== 'boolean') {
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }

    const artist = this.artistService.findOne(params.id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const newArtist = this.artistService.update(params.id, updateArtistDTO);
    return newArtist;
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

    const artist = this.artistService.findOne(params.id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.artistService.delete(params.id);
    return;
  }
}
