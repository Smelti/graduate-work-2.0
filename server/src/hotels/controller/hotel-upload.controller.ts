import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HotelService } from '../hotel.service';
import { HotelRoomService } from '../hotel-room.service';
import { Hotel } from '../schemas/hotel.schema';
import { HotelRoom } from '../schemas/hotel-room.schema';

@Controller('api/admin/upload')
export class HotelUploadController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomService: HotelRoomService,
  ) {}

  @Post('hotel/:hotelId')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/hotels',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadHotelImages(
    @Param('hotelId') hotelId: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Hotel> {
    const images: string[] = (files ?? []).map(
      (file) => `uploads/hotels/${file.filename}`,
    );

    return this.hotelService.update(hotelId, { images });
  }

  @Post('room/:roomId')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/rooms',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadRoomImages(
    @Param('roomId') roomId: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<HotelRoom> {
    const images: string[] = (files ?? []).map(
      (file) => `uploads/rooms/${file.filename}`,
    );

    return this.roomService.update(roomId, { images });
  }
}
