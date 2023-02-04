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
import { CreateArtistDTO, UpdateArtistDTO } from 'src/artists/dto/artist.dto';
import { ArtistService } from './artist.service';
import { Artist } from './interfaces/artist.interface';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    const artists = await this.artistService.findAll();
    return artists;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Artist> {
    const artist = await this.artistService.findOne(id);
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
    const newArtist = await this.artistService.create(createArtistDTO);
    return newArtist;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateArtistDTO: UpdateArtistDTO,
  ): Promise<Artist> {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const newArtist = await this.artistService.update(id, updateArtistDTO);
    return newArtist;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.artistService.delete(id);
    return;
  }
}
