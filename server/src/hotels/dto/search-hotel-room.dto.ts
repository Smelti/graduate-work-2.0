import { IsOptional, IsMongoId, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchHotelRoomDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsMongoId()
  hotel?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isEnabled?: boolean;
}
