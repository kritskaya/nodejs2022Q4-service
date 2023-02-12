import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrackDTO, UpdateTrackDTO } from './dto/track.dto';
import { Track } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    return this.prisma.track.findUnique({
      where: {
        id,
      },
    });
  }

  async create(dto: CreateTrackDTO): Promise<Track> {
    return this.prisma.track.create({
      data: {
        name: dto.name,
        artistId: dto.artistId,
        albumId: dto.albumId,
        duration: dto.duration,
      },
    });
  }

  async update(id: string, dto: UpdateTrackDTO): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });

    return this.prisma.track.update({
      where: {
        id,
      },
      data: {
        ...track,
        name: dto.name ? dto.name : track.name,
        artistId:
          dto.artistId || dto.artistId === null ? dto.artistId : track.artistId,
        albumId:
          dto.albumId || dto.albumId === null ? dto.albumId : track.albumId,
        duration: dto.duration ? dto.duration : track.duration,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.track.delete({
      where: {
        id,
      },
    });

    // const favs = await this.dbService.getFavTracks();
    // const isFav = favs.includes(id);
    // if (isFav) {
    //   await this.dbService.removeTrackFromFav(id);
    // }
  }
}
