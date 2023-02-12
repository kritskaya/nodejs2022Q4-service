import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/album.dto';
import { Album } from './interfaces/album.interface';

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
    await this.prisma.album.delete({
      where: {
        id,
      },
    });

    // const tracks = await this.dbService.getAllTracks();
    // for (const track of tracks) {
    //   if (track.albumId === id) {
    //     await this.dbService.updateTrack(track.id, { ...track, albumId: null });
    //   }
    // }

    // const favs = await this.dbService.getFavAlbums();
    // const isFav = favs.includes(id);
    // if (isFav) {
    //   await this.dbService.removeAlbumFromFav(id);
    // }
  }
}
