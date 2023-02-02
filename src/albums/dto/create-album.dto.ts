export class CreateAlbumDTO {
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
