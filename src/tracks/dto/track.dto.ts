import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { IsUUIDorNull } from 'src/validation/decorators/IsUUIDorNull';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTrackDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsUUIDorNull()
  artistId: string | null;

  @IsUUIDorNull()
  albumId: string | null;

  @IsNotEmpty()
  @IsInt()
  duration: number;
}

export class UpdateTrackDTO extends PartialType(CreateTrackDTO) {}
