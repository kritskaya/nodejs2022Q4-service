import { Album, Artist, Track } from '@prisma/client';

export interface FavoritesRepsonse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export interface CreateUpdateFavoriteResponse {
  message: string;
}
