import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';

export class UpdateHotelRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  hotelId?: string;

  @IsOptional()
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
