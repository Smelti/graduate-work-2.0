import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';

export class CreateHotelRoomDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  hotelId: string;

  @IsOptional()
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
