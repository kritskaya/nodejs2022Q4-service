import { Injectable } from '@nestjs/common';
import { CreateArtistDTO, UpdateArtistDTO } from 'src/artists/dto/artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Artist } from 'prisma/prisma-client';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    return await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
  }

  async create(artistDTO: CreateArtistDTO): Promise<Artist> {
    const newArtist = await this.prisma.artist.create({
      data: {
        name: artistDTO.name,
        grammy: artistDTO.grammy,
      },
    });
    return newArtist;
  }

  async update(id: string, updateArtistDTO: UpdateArtistDTO): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });

    const updatedArtist = await this.prisma.artist.update({
      where: {
        id,
      },
      data: {
        ...artist,
        name: updateArtistDTO.name ? updateArtistDTO.name : artist.name,
        grammy:
          updateArtistDTO.grammy !== undefined
            ? updateArtistDTO.grammy
            : artist.grammy,
      },
    });

    return updatedArtist;
  }

  async delete(id: string) {
    const albums = await this.prisma.album.findMany();
    for (const album of albums) {
      if (album.artistId === id) {
        await this.prisma.album.update({
          where: {
            id: album.id,
          },
          data: {
            ...album,
            artistId: null,
          },
        });
      }
    }

    const tracks = await this.prisma.track.findMany();
    for (const track of tracks) {
      if (track.artistId === id) {
        await this.prisma.track.update({
          where: {
            id: track.id,
          },
          data: {
            ...track,
            artistId: null,
          },
        });
      }
    }

    const favs = await this.prisma.favouriteArtist.findMany();

    const isFav = favs.find((fav) => fav.artistId === id);
    if (isFav) {
      await this.prisma.favouriteArtist.delete({
        where: {
          artistId: id,
        },
      });
    }

    await this.prisma.artist.delete({
      where: {
        id,
      },
    });
  }
}
