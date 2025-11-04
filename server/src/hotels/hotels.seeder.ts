import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';

@Injectable()
export class HotelsSeeder implements OnModuleInit {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name) private roomModel: Model<HotelRoomDocument>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const hotelCount = await this.hotelModel.countDocuments();
    if (hotelCount === 0) {
      const hotel1 = await this.hotelModel.create({
        title: 'Гранд Отель "Москва"',
        description: 'Отель с видом на Москва-Сити.',
        images: ['uploads/hotels/1760117935799-201714021.jpg'],
      });

      const hotel2 = await this.hotelModel.create({
        title: 'Отель "Унисон"',
        description: 'Комфортный отель в центре города.',
        images: ['uploads/hotels/1760131680608-55288162.webp'],
      });

      await this.roomModel.create({
        hotel: hotel1._id,
        name: 'Убежище',
        description: 'Уютный отель за городом.',
        images: ['uploads/rooms/1760131445232-833709104.jpg'],
        isEnabled: true,
      });

      await this.roomModel.create({
        hotel: hotel1._id,
        name: 'Стандартная комната',
        description: 'Комната с одной кроватью.',
        images: ['uploads/rooms/1760131445232-953020599.jpg'],
        isEnabled: true,
      });

      await this.roomModel.create({
        hotel: hotel2._id,
        name: 'Vip',
        description: 'Премиум комната для роскошной жизни в отеле.',
        images: ['uploads/rooms/1760131601312-422893917.jpg'],
        isEnabled: true,
      });

      await this.roomModel.create({
        hotel: hotel2._id,
        name: 'Семейная комната',
        description: 'Большая комната для всей семьи',
        images: ['uploads/rooms/1760131775345-67120659.jpg'],
        isEnabled: true,
      });

      console.log('Sample hotels and rooms created successfully');
    }
  }
}
