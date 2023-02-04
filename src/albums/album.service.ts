import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { v4 as uuid4 } from 'uuid';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/album.dto';
import { Album } from './interfaces/album.interface';

@Injectable()
export class AlbumService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<Album[]> {
    return await this.dbService.getAllAlbums();
  }

  async findOne(id: string): Promise<Album> {
    return await this.dbService.getAlbum(id);
  }

  async create(createAlbumDTO: CreateAlbumDTO): Promise<Album> {
    const newAlbum: Album = {
      id: uuid4(),
      name: createAlbumDTO.name,
      year: createAlbumDTO.year,
      artistId: createAlbumDTO.artistId,
    };

    await this.dbService.createAlbum(newAlbum);

    return newAlbum;
  }

  async update(id: string, updateAlbumDTO: UpdateAlbumDTO): Promise<Album> {
    const album = await this.dbService.getAlbum(id);

    const updatedAlbum: Album = {
      ...album,
      name: updateAlbumDTO.name ? updateAlbumDTO.name : album.name,
      year: updateAlbumDTO.year ? updateAlbumDTO.year : album.year,
      artistId:
        updateAlbumDTO.artistId || updateAlbumDTO.artistId === null
          ? updateAlbumDTO.artistId
          : album.artistId,
    };

    await this.dbService.updateAlbum(id, updatedAlbum);

    return updatedAlbum;
  }

  async delete(id: string) {
    await this.dbService.deleteAlbum(id);

    const tracks = await this.dbService.getAllTracks();
    for (const track of tracks) {
      if (track.albumId === id) {
        await this.dbService.updateTrack(track.id, { ...track, albumId: null });
      }
    }

    const favs = await this.dbService.getFavAlbums();
    const isFav = favs.includes(id);
    if (isFav) {
      await this.dbService.removeAlbumFromFav(id);
    }
  }
}
