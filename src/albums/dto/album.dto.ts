import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IsUUIDorNull } from 'src/validation/decorators/IsUUIDorNull';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAlbumDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsUUIDorNull()
  artistId: string | null; // refers to Artist
}

export class UpdateAlbumDTO extends PartialType(CreateAlbumDTO) {}
