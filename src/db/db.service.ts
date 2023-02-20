import { Injectable } from '@nestjs/common'
import { Album } from '../albums/interfaces/album.interface';
import { Artist } from '../artists/interfaces/artist.interface';
import { Favorites } from '../favourites/interfaces/favourites.interface';
import { Track } from '../tracks/interfaces/track.interface';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class DBService {
  private readonly users: User[] = [
    {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      login: 'testUser',
      password: 'password',
      version: 1,
      createdAt: 1674784901,
      updatedAt: 1674784901,
    },
  ];
  private readonly albums: Album[] = [
    {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4be2',
      name: 'Album name',
      year: 2020,
      artistId: null,
    },
  ];
  private readonly artists: Artist[] = [
    {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4be1',
      name: 'Red Hot Chilly Peppers',
      grammy: true,
    },
  ];
  private readonly tracks: Track[] = [
    {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bee',
      name: 'Track name',
      artistId: null,
      albumId: null,
      duration: 125,
    },
  ];
  private readonly favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUser(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  async createUser(newUser: User) {
    this.users.push(newUser);
  }

  async updateUser(id: string, updatedUser: User) {
    const userIndex = this.users.findIndex((item) => item.id === id);
    this.users[userIndex] = updatedUser;
  }

  async deleteUser(id: string) {
    const userIndex = this.users.findIndex((item) => item.id === id);
    this.users.splice(userIndex, 1);
  }

  async getAllAlbums(): Promise<Album[]> {
    return this.albums;
  }

  async getAlbum(id: string): Promise<Album> {
    const album = this.albums.find((album) => album.id === id);
    return album;
  }

  async createAlbum(newAlbum: Album) {
    this.albums.push(newAlbum);
  }

  async updateAlbum(id: string, updatedAlbum: Album) {
    const index = this.albums.findIndex((album) => album.id === id);
    this.albums[index] = updatedAlbum;
  }

  async deleteAlbum(id: string) {
    const index = this.albums.findIndex((album) => album.id === id);
    this.albums.splice(index, 1);
  }

  async getAllArtists(): Promise<Artist[]> {
    return this.artists;
  }

  async getArtist(id: string): Promise<Artist> {
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  }

  async createArtist(newArtist: Artist) {
    this.artists.push(newArtist);
  }

  async updateArtist(id: string, updatedArtist: Artist) {
    const index = this.artists.findIndex((artist) => artist.id === id);
    this.artists[index] = updatedArtist;
  }

  async deleteArtist(id: string) {
    const index = this.artists.findIndex((artist) => artist.id === id);
    this.artists.splice(index, 1);
  }

  async getAllTracks(): Promise<Track[]> {
    return this.tracks;
  }

  async getTrack(id: string): Promise<Track> {
    const track = this.tracks.find((track) => track.id === id);
    return track;
  }

  async createTrack(newTrack: Track) {
    this.tracks.push(newTrack);
  }

  async updateTrack(id: string, updatedTrack: Track) {
    const index = this.tracks.findIndex((track) => track.id === id);
    this.tracks[index] = updatedTrack;
  }

  async deleteTrack(id: string) {
    const index = this.tracks.findIndex((track) => track.id === id);
    this.tracks.splice(index, 1);
  }

  async getAllFavs(): Promise<Favorites> {
    return this.favs;
  }

  async getFavTracks(): Promise<string[]> {
    return this.favs.tracks;
  }

  async getFavAlbums(): Promise<string[]> {
    return this.favs.albums;
  }

  async getFavArtists(): Promise<string[]> {
    return this.favs.artists;
  }

  async addTrackToFav(id: string): Promise<string> {
    const track = this.favs.tracks.find((trackId) => trackId === id);
    if (track) {
      return 'This track has already added to favourites ealier';
    }

    this.favs.tracks.push(id);
    return 'Track successfully added to favourites';
  }

  async removeTrackFromFav(id: string) {
    const index = this.favs.tracks.findIndex((trackId) => trackId === id);
    this.favs.tracks.splice(index, 1);
  }

  async addArtistToFav(id: string): Promise<string> {
    const artist = this.favs.artists.find((artistId) => artistId === id);
    if (artist) {
      return 'This artist has already added to favourites ealier';
    }

    this.favs.artists.push(id);
    return 'Artist successfully added to favourites';
  }

  async removeArtistFromFav(id: string) {
    const index = this.favs.artists.findIndex((artistId) => artistId === id);
    this.favs.artists.splice(index, 1);
  }

  async addAlbumToFav(id: string): Promise<string> {
    const album = this.favs.albums.find((albumId) => albumId === id);
    if (album) {
      return 'This album has already added to favourites ealier';
    }

    this.favs.albums.push(id);
    return 'Album successfully added to favourites';
  }

  async removeAlbumFromFav(id: string) {
    const index = this.favs.tracks.findIndex((albumId) => albumId === id);
    this.favs.albums.splice(index, 1);
  }
}
