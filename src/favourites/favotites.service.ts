import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Favorites } from './interfaces/favourites.interface';

@Injectable()
export class FavouritesService {
  private readonly favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  findAll(): Favorites {
    return this.favs;
  }

  findTracks(): String[] {
    return this.favs.tracks;
  }

  findAlbums(): String[] {
    return this.favs.albums;
  }

  findArtists(): String[] {
    return this.favs.artists;
  }

  addTrack(id: string): string {
    const track = this.favs.tracks.find((trackId) => trackId === id);
    if (track) {
      return 'This track has already added to favourites ealier';
    }

    this.favs.tracks.push(id);
    return 'Track successfully added to favourites';
  }

  removeTrack(id: string) {
    const index = this.favs.tracks.findIndex((trackId) => trackId === id);
    this.favs.tracks.splice(index, 1);
  }

  addArtist(id: string) {
    const artist = this.favs.artists.find((artistId) => artistId === id);
    if (artist) {
      return 'This artist has already added to favourites ealier';
    }

    this.favs.artists.push(id);
    return 'Artist successfully added to favourites';
  }

  removeArtist(id: string) {
    const index = this.favs.artists.findIndex((artistId) => artistId === id);
    this.favs.artists.splice(index, 1);
  }

  addAlbum(id: string) {
    const album = this.favs.albums.find((albumId) => albumId === id);
    if (album) {
      return 'This album has already added to favourites ealier';
    }

    this.favs.albums.push(id);
    return 'Album successfully added to favourites';
  }

  removeAlbum(id: string) {
    const index = this.favs.tracks.findIndex((albumId) => albumId === id);
    this.favs.albums.splice(index, 1);
  }
}
