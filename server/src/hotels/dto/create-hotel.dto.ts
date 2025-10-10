import { IsString, MinLength, IsArray, IsOptional } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(5)
  description?: string;

  @IsArray()
  @IsOptional()
  images?: string[];
}
