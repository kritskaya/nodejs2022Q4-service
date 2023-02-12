import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { DBService } from 'src/db/db.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoritesRepsonse } from './dto/FavouritesResponse';

@Injectable()
export class FavouritesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<FavoritesRepsonse> {
    const allArtists = await this.prisma.artist.findMany();
    const favArtistData = await this.prisma.favouriteArtist.findMany();
    const artists = favArtistData.map((fav) =>
      allArtists.find((artist) => artist.id === fav.artistId),
    );

    const allAlbums = await this.prisma.album.findMany();
    const favAlbumData = await this.prisma.favouriteAlbum.findMany();
    const albums = favAlbumData.map((fav) =>
      allAlbums.find((album) => album.id === fav.albumId),
    );

    const allTracks = await this.prisma.track.findMany();
    const favTrackData = await this.prisma.favouriteTrack.findMany();
    const tracks = favTrackData.map((fav) =>
      allTracks.find((track) => track.id === fav.trackId),
    );

    return {
      artists,
      albums,
      tracks,
    };
  }

  async findTracks(): Promise<string[]> {
    const result = await this.prisma.favouriteTrack.findMany();
    return result.map((track) => track.trackId);
  }

  async findAlbums(): Promise<string[]> {
    const result = await this.prisma.favouriteAlbum.findMany();
    return result.map((album) => album.albumId);
  }

  async findArtists(): Promise<string[]> {
    const result = await this.prisma.favouriteArtist.findMany();
    return result.map((artist) => artist.artistId);
  }

  async addTrack(id: string): Promise<string> {
    const track = await this.prisma.favouriteTrack.findUnique({
      where: {
        trackId: id,
      },
    });

    if (track) {
      return 'This track has already added to favourites ealier';
    }

    await this.prisma.favouriteTrack.create({
      data: {
        trackId: id,
      },
    });

    return 'Track successfully added to favourites';
  }

  async removeTrack(id: string) {
    await this.prisma.favouriteTrack.delete({
      where: {
        trackId: id,
      },
    });
  }

  async addArtist(id: string): Promise<string> {
    const artist = await this.prisma.favouriteArtist.findUnique({
      where: {
        artistId: id,
      },
    });

    if (artist) {
      return 'This artist has already added to favourites ealier';
    }

    await this.prisma.favouriteArtist.create({
      data: {
        artistId: id,
      },
    });

    return 'Artist successfully added to favourites';
  }

  async removeArtist(id: string) {
    await this.prisma.favouriteArtist.delete({
      where: {
        artistId: id,
      },
    });
  }

  async addAlbum(id: string): Promise<string> {
    const album = await this.prisma.favouriteAlbum.findUnique({
      where: {
        albumId: id,
      },
    });

    if (album) {
      return 'This album has already added to favourites ealier';
    }

    await this.prisma.favouriteAlbum.create({
      data: {
        albumId: id,
      },
    });

    return 'Album successfully added to favourites';
  }

  async removeAlbum(id: string) {
    await this.prisma.favouriteAlbum.delete({
      where: {
        albumId: id,
      },
    });
  }
}
