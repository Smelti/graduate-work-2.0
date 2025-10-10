import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { HotelService } from '../hotel.service';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { SearchHotelDto } from '../dto/search-hotel.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/users.schema';
import type { HotelDocument } from '../schemas/hotel.schema';

@Controller('api/admin/hotels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminHotelsController {
  constructor(private readonly hotelsService: HotelService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateHotelDto) {
    try {
      const h: HotelDocument = await this.hotelsService.create(dto);
      return {
        id: h._id.toString(),
        title: h.title,
        description: h.description,
        images: h.images ?? [],
      };
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async getAll(@Query() query: SearchHotelDto) {
    try {
      let list: HotelDocument[] = await this.hotelsService.findAll();

      list = list.filter((h) => h.title.includes(query.title ?? ''));
      const offset = query.offset ?? 0;
      const limit = query.limit ?? 10;
      const pagedList = list.slice(offset, offset + limit);

      return pagedList.map((h) => ({
        id: h._id.toString(),
        title: h.title,
        description: h.description,
        images: h.images ?? [],
      }));
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }

  @Roles(UserRole.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateHotelDto) {
    try {
      const h: HotelDocument = await this.hotelsService.update(id, dto);
      return {
        id: h._id.toString(),
        title: h.title,
        description: h.description,
        images: h.images ?? [],
      };
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.hotelsService.delete(id);
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }
}
