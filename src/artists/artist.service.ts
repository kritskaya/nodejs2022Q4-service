import { Injectable } from '@nestjs/common';
import { CreateArtistDTO, UpdateArtistDTO } from 'src/artists/dto/artist.dto';
import { v4 as uuid4 } from 'uuid';
import { Artist } from './interfaces/artist.interface';

@Injectable()
export class ArtistService {
  private readonly artists: Artist[] = [
    {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4be1',
      name: 'Red Hot Chilly Peppers',
      grammy: true,
    },
  ];

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  }

  create(artistDTO: CreateArtistDTO): Artist {
    const newArtist = {
      id: uuid4(),
      name: artistDTO.name,
      grammy: artistDTO.grammy,
    };

    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDTO: UpdateArtistDTO) {
    const artist = this.findOne(id);

    const updatedArtist = {
      ...artist,
      grammy: updateArtistDTO.grammy,
    };

    const index = this.artists.findIndex((artist) => artist.id === id);
    this.artists[index] = updatedArtist;

    return updatedArtist;
  }

  delete(id: string) {
    const index = this.artists.findIndex((artist) => artist.id === id);
    this.artists.splice(index, 1);
  }
}
