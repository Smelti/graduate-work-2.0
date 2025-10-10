import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { HotelRoomService } from '../hotel-room.service';
import { SearchHotelRoomDto } from '../dto/search-hotel-room.dto';
import type { Request } from 'express';
import { UserRole } from 'src/users/users.schema';
import type { HotelRoomDocument } from '../schemas/hotel-room.schema';
import type { HotelDocument } from '../schemas/hotel.schema';

@Controller('api/common/hotel-rooms')
export class CommonHotelRoomsController {
  constructor(private readonly hotelRoomsService: HotelRoomService) {}

  @Get()
  async search(@Query() query: SearchHotelRoomDto, @Req() req: Request) {
    const user = req.user as { role?: UserRole } | undefined;
    let isEnabled = query.isEnabled;
    if (!user || user.role === UserRole.CLIENT) isEnabled = true;

    try {
      let rooms: HotelRoomDocument[] = await this.hotelRoomsService.findAll();

      if (query.hotel) {
        rooms = rooms.filter(
          (r) =>
            r.hotel &&
            (r.hotel as HotelDocument)._id.toString() === query.hotel,
        );
      }
      if (typeof isEnabled === 'boolean') {
        rooms = rooms.filter((r) => r.isEnabled === isEnabled);
      }

      const offset = query.offset ?? 0;
      const limit = query.limit ?? 10;
      const pagedRooms = rooms.slice(offset, offset + limit);

      return pagedRooms.map((r) => {
        const hotelPop = r.hotel as HotelDocument | undefined;
        return {
          id: r._id.toString(),
          name: r.name,
          description: r.description,
          images: r.images,
          hotel: hotelPop
            ? { _id: hotelPop._id.toString(), title: hotelPop.title }
            : null,
        };
      });
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const r: HotelRoomDocument | null =
        await this.hotelRoomsService.findById(id);
      if (!r) return null;
      const h = r.hotel as HotelDocument | undefined;
      return {
        id: r._id.toString(),
        name: r.name,
        description: r.description,
        images: r.images,
        hotel: h
          ? { id: h._id.toString(), title: h.title, description: h.description }
          : null,
      };
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }
}
