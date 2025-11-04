import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { HotelService } from './hotel.service';
import { HotelRoomService } from './hotel-room.service';
import { HotelsSeeder } from './hotels.seeder';

import { CommonHotelsController } from './controller/common-hotels.controller';
import { CommonHotelRoomsController } from './controller/common-hotel-rooms.controller';
import { AdminHotelsController } from './controller/admin-hotel.controller';
import { AdminHotelRoomsController } from './controller/admin-hotel-rooms.controller';
import { HotelUploadController } from './controller/hotel-upload.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [HotelService, HotelRoomService, HotelsSeeder],
  controllers: [
    CommonHotelsController,
    CommonHotelRoomsController,
    AdminHotelsController,
    AdminHotelRoomsController,
    HotelUploadController,
  ],
  exports: [HotelService, HotelRoomService],
})
export class HotelsModule {}
