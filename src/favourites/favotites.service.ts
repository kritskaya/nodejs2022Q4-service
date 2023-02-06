import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { DBService } from 'src/db/db.service';
import { FavoritesRepsonse } from './dto/FavouritesResponse';

@Injectable()
export class FavouritesService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<FavoritesRepsonse> {
    const favIds = await this.dbService.getAllFavs();
    const artists = await Promise.all(
      favIds.artists.map(async (id) => this.dbService.getArtist(id)),
    );
    const albums = await Promise.all(
      favIds.albums.map((id) => this.dbService.getAlbum(id)),
    );
    const tracks = await Promise.all(
      favIds.tracks.map((id) => this.dbService.getTrack(id)),
    );

    return {
      artists,
      albums,
      tracks,
    };
  }

  async findTracks(): Promise<string[]> {
    return await this.dbService.getFavTracks();
  }

  async findAlbums(): Promise<string[]> {
    return await this.dbService.getFavAlbums();
  }

  async findArtists(): Promise<string[]> {
    return await this.dbService.getFavArtists();
  }

  async addTrack(id: string): Promise<string> {
    return await this.dbService.addTrackToFav(id);
  }

  async removeTrack(id: string) {
    await this.dbService.removeTrackFromFav(id);
  }

  async addArtist(id: string): Promise<string> {
    return await this.dbService.addArtistToFav(id);
  }

  async removeArtist(id: string) {
    await this.dbService.removeArtistFromFav(id);
  }

  async addAlbum(id: string): Promise<string> {
    return await this.dbService.addAlbumToFav(id);
  }

  async removeAlbum(id: string) {
    await this.dbService.removeAlbumFromFav(id);
  }
}
