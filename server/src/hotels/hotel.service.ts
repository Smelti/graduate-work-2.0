import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { CreateHotelDto } from './dto/create-hotel.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(dto: CreateHotelDto): Promise<HotelDocument> {
    const hotel = new this.hotelModel(dto);
    return hotel.save();
  }

  async findAll(): Promise<HotelDocument[]> {
    return this.hotelModel.find().exec();
  }

  async findById(id: string): Promise<HotelDocument> {
    const hotel = await this.hotelModel.findById(id).exec();
    if (!hotel) throw new NotFoundException('Отель не найден');
    return hotel;
  }

  async update(id: string, dto: UpdateHotelDto): Promise<HotelDocument> {
    const oldHotel = await this.hotelModel.findById(id).exec();
    if (!oldHotel) throw new NotFoundException('Отель не найден');

    const hotel = await this.hotelModel
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .exec();
    if (!hotel) throw new NotFoundException('Отель не найден');

    if (oldHotel.images) {
      const newImages = hotel.images || [];
      for (const img of oldHotel.images) {
        if (!newImages.includes(img)) {
          const filePath = path.join(process.cwd(), img);
          try {
            await fs.promises.unlink(filePath);
          } catch {
            // ignore
          }
        }
      }
    }

    return hotel;
  }

  async delete(id: string): Promise<void> {
    const hotel = await this.hotelModel.findById(id).exec();
    if (!hotel) throw new NotFoundException('Отель не найден');

    if (hotel.images) {
      for (const img of hotel.images) {
        const filePath = path.join(process.cwd(), img);
        try {
          await fs.promises.unlink(filePath);
        } catch {
          // ignore
        }
      }
    }

    await this.hotelModel.findByIdAndDelete(id).exec();
  }
}
