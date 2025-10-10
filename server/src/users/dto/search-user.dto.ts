import { IsNumber, IsOptional, IsString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}
