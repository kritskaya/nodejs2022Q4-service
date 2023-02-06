import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUUIDorNull } from 'src/validation/decorators/IsUUIDorNull';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAlbumDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsOptional()
  @IsUUIDorNull()
  artistId: string | null = null; // refers to Artist
}

export class UpdateAlbumDTO extends PartialType(CreateAlbumDTO) {}
