export class UpdateAlbumDTO {
  name?: string;
  year?: number;
  artistId?: string | null; // refers to Artist
}