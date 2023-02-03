import { Injectable } from '@nestjs/common';
import { Track } from 'src/tracks/interfaces/track.interface';
import { v4 as uuid4 } from 'uuid';
import { CreateTrackDTO, UpdateTrackDTO } from './dto/track.dto';

@Injectable()
export class TrackService {
  private readonly tracks: Track[] = [
    {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bee',
      name: 'Track name',
      artistId: null,
      albumId: null,
      duration: 125,
    },
  ];

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    const track = this.tracks.find((track) => track.id === id);
    return track;
  }

  create(dto: CreateTrackDTO) {
    const newTrack: Track = {
      id: uuid4(),
      name: dto.name,
      artistId: dto.albumId,
      albumId: dto.albumId,
      duration: dto.duration,
    };

    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, dto: UpdateTrackDTO) {
    const track = this.findOne(id);

    const updatedTrack: Track = {
      ...track,
      name: dto.name ? dto.name : track.name,
      artistId:
        dto.artistId || dto.artistId === null ? dto.artistId : track.artistId,
      albumId:
        dto.albumId || dto.albumId === null ? dto.albumId : track.albumId,
      duration: dto.duration ? dto.duration : track.duration,
    };

    const index = this.tracks.findIndex((track) => track.id === id);
    this.tracks[index] = updatedTrack;

    return updatedTrack;
  }

  delete(id: string) {
    const index = this.tracks.findIndex((track) => track.id === id);
    this.tracks.splice(index, 1);
  }
}
