import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { HotelService } from '../hotel.service';
import { SearchHotelDto } from '../dto/search-hotel.dto';
import type { HotelDocument } from '../schemas/hotel.schema';

@Controller('api/common/hotels')
export class CommonHotelsController {
  constructor(private readonly hotelsService: HotelService) {}

  @Get()
  async search(@Query() query: SearchHotelDto) {
    try {
      let list: HotelDocument[] = await this.hotelsService.findAll();

      list = list.filter((h) => h.title.includes(query.title ?? ''));
      const offset = query.offset ?? 0;
      const limit = query.limit ?? 10;
      const pagedList = list.slice(offset, offset + limit);

      return pagedList.map((h) => ({
        _id: h._id.toString(),
        title: h.title,
        description: h.description,
        images: h.images ?? [],
      }));
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const h: HotelDocument | null = await this.hotelsService.findById(id);
      if (!h) return null;
      return {
        _id: h._id.toString(),
        title: h.title,
        description: h.description,
        images: h.images ?? [],
      };
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }
}
