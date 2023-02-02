import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';
import { Album } from './interfaces/album.interface';

@Injectable()
export class AlbumService {
  private readonly albums: Album[] = [
    {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4be2',
      name: 'Album name',
      year: 2020,
      artistId: null,
    },
  ];

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((album) => album.id === id);
    return album;
  }

  create(createAlbumDTO: CreateAlbumDTO): Album {
    const newAlbum: Album = {
      id: uuid4(),
      name: createAlbumDTO.name,
      year: createAlbumDTO.year,
      artistId: createAlbumDTO.artistId,
    };

    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDTO: UpdateAlbumDTO): Album {
    const album = this.findOne(id);

    const updatedAlbum: Album = {
      ...album,
      name: updateAlbumDTO.name ? updateAlbumDTO.name : album.name,
      year: updateAlbumDTO.year ? updateAlbumDTO.year : album.year,
      artistId:
        updateAlbumDTO.artistId || updateAlbumDTO.artistId === null
          ? updateAlbumDTO.artistId
          : album.artistId,
    };

    const index = this.albums.findIndex((album) => album.id === id);
    this.albums[index] = updatedAlbum;

    return updatedAlbum;
  }

  delete(id: string) {
    const index = this.albums.findIndex((album) => album.id === id);
    this.albums.splice(index, 1);
  }
}
