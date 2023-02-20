import { Injectable } from '@nestjs/common';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/album.dto';
import { Album } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    return this.prisma.album.findUnique({
      where: {
        id,
      },
    });
  }

  async create(createAlbumDTO: CreateAlbumDTO): Promise<Album> {
    return this.prisma.album.create({
      data: {
        name: createAlbumDTO.name,
        year: createAlbumDTO.year,
        artistId: createAlbumDTO.artistId,
      },
    });
  }

  async update(id: string, updateAlbumDTO: UpdateAlbumDTO): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });

    return this.prisma.album.update({
      where: {
        id,
      },
      data: {
        name: updateAlbumDTO.name ? updateAlbumDTO.name : album.name,
        year: updateAlbumDTO.year ? updateAlbumDTO.year : album.year,
        artistId:
          updateAlbumDTO.artistId || updateAlbumDTO.artistId === null
            ? updateAlbumDTO.artistId
            : album.artistId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const tracks = await this.prisma.track.findMany();
    for (const track of tracks) {
      if (track.albumId === id) {
        await this.prisma.track.update({
          where: {
            id: track.id,
          },
          data: {
            ...track,
            albumId: null,
          },
        });
      }
    }

    const favs = await this.prisma.favouriteAlbum.findMany();

    const isFav = favs.find((fav) => fav.albumId === id);
    if (isFav) {
      await this.prisma.favouriteAlbum.delete({
        where: {
          albumId: id,
        },
      });
    }

    await this.prisma.album.delete({
      where: {
        id,
      },
    });
  }
}
