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
    await this.prisma.artist.delete({
      where: {
        id,
      },
    });

    // const albums = await this.dbService.getAllAlbums();
    // for (const album of albums) {
    //   if (album.artistId === id) {
    //     await this.dbService.updateAlbum(album.id, {
    //       ...album,
    //       artistId: null,
    //     });
    //   }
    // }

    // const tracks = await this.dbService.getAllTracks();
    // for (const track of tracks) {
    //   if (track.artistId === id) {
    //     await this.dbService.updateTrack(track.id, {
    //       ...track,
    //       artistId: null,
    //     });
    //   }
    // }

    // const favs = await this.dbService.getFavArtists();
    // const isFav = favs.includes(id);
    // if (isFav) {
    //   this.dbService.removeArtistFromFav(id);
    // }
  }
}
