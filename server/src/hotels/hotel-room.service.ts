import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';
import { UpdateHotelRoomDto } from './dto/update-hotel-room.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name) private roomModel: Model<HotelRoomDocument>,
  ) {}

  async create(
    dto: CreateHotelRoomDto,
    images: string[] = [],
  ): Promise<HotelRoomDocument> {
    const room = new this.roomModel({
      name: dto.name,
      description: dto.description,
      hotel: new Types.ObjectId(dto.hotelId),
      images,
      isEnabled: dto.isEnabled ?? true,
    });

    return room.save();
  }

  async findAll(): Promise<HotelRoomDocument[]> {
    return this.roomModel.find().populate('hotel', 'title description').exec();
  }

  async findById(id: string): Promise<HotelRoomDocument> {
    const room = await this.roomModel
      .findById(id)
      .populate('hotel', 'title description')
      .exec();
    if (!room) throw new NotFoundException('Комната не найдена');
    return room;
  }

  async update(
    id: string,
    dto: UpdateHotelRoomDto,
  ): Promise<HotelRoomDocument> {
    const oldRoom = await this.roomModel.findById(id).exec();
    if (!oldRoom) throw new NotFoundException('Комната не найдена');

    const updated = await this.roomModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Комната не найдена');

    if (oldRoom.images) {
      const newImages = updated.images || [];
      for (const img of oldRoom.images) {
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

    return updated;
  }

  async remove(id: string): Promise<void> {
    const room = await this.roomModel.findById(id).exec();
    if (!room) throw new NotFoundException('Отель не найден');

    if (room.images) {
      for (const img of room.images) {
        const filePath = path.join(process.cwd(), img);
        try {
          await fs.promises.unlink(filePath);
        } catch {
          // ignore
        }
      }
    }

    await this.roomModel.findByIdAndDelete(id).exec();
  }
}
