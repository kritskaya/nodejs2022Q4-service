import { Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { Track } from 'src/tracks/interfaces/track.interface';
import { v4 as uuid4 } from 'uuid';
import { CreateTrackDTO, UpdateTrackDTO } from './dto/track.dto';

@Injectable()
export class TrackService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<Track[]> {
    return await this.dbService.getAllTracks();
  }

  async findOne(id: string): Promise<Track> {
    return await this.dbService.getTrack(id);
  }

  async create(dto: CreateTrackDTO): Promise<Track> {
    const newTrack: Track = {
      id: uuid4(),
      name: dto.name,
      artistId: dto.artistId,
      albumId: dto.albumId,
      duration: dto.duration,
    };

    await this.dbService.createTrack(newTrack);

    return newTrack;
  }

  async update(id: string, dto: UpdateTrackDTO): Promise<Track> {
    const track = await this.dbService.getTrack(id);

    const updatedTrack: Track = {
      ...track,
      name: dto.name ? dto.name : track.name,
      artistId:
        dto.artistId || dto.artistId === null ? dto.artistId : track.artistId,
      albumId:
        dto.albumId || dto.albumId === null ? dto.albumId : track.albumId,
      duration: dto.duration ? dto.duration : track.duration,
    };

    await this.dbService.updateTrack(id, updatedTrack);

    return updatedTrack;
  }

  async delete(id: string) {
    await this.dbService.deleteTrack(id);

    const favs = await this.dbService.getFavTracks();
    const isFav = favs.includes(id);
    if (isFav) {
      await this.dbService.removeTrackFromFav(id);
    }
  }
}
