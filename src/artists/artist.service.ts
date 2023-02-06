import { Injectable } from '@nestjs/common';
import { CreateArtistDTO, UpdateArtistDTO } from 'src/artists/dto/artist.dto';
import { DBService } from 'src/db/db.service';
import { v4 as uuid4 } from 'uuid';
import { Artist } from './interfaces/artist.interface';

@Injectable()
export class ArtistService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<Artist[]> {
    return await this.dbService.getAllArtists();
  }

  async findOne(id: string): Promise<Artist> {
    return await this.dbService.getArtist(id);
  }

  async create(artistDTO: CreateArtistDTO): Promise<Artist> {
    const newArtist = {
      id: uuid4(),
      name: artistDTO.name,
      grammy: artistDTO.grammy,
    };

    await this.dbService.createArtist(newArtist);
    return newArtist;
  }

  async update(id: string, updateArtistDTO: UpdateArtistDTO): Promise<Artist> {
    const artist = await this.dbService.getArtist(id);

    const updatedArtist = {
      ...artist,
      name: updateArtistDTO.name ? updateArtistDTO.name : artist.name,
      grammy:
        updateArtistDTO.grammy !== undefined
          ? updateArtistDTO.grammy
          : artist.grammy,
    };

    await this.dbService.updateArtist(id, updatedArtist);

    return updatedArtist;
  }

  async delete(id: string) {
    await this.dbService.deleteArtist(id);

    const albums = await this.dbService.getAllAlbums();
    for (const album of albums) {
      if (album.artistId === id) {
        await this.dbService.updateAlbum(album.id, {
          ...album,
          artistId: null,
        });
      }
    }

    const tracks = await this.dbService.getAllTracks();
    for (const track of tracks) {
      if (track.artistId === id) {
        await this.dbService.updateTrack(track.id, {
          ...track,
          artistId: null,
        });
      }
    }

    const favs = await this.dbService.getFavArtists();
    const isFav = favs.includes(id);
    if (isFav) {
      this.dbService.removeArtistFromFav(id);
    }
  }
}
