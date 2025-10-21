/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-base-to-string, @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';
import {
  ReservationDto,
  ReservationSearchOptions,
  IReservation,
  ID,
} from './reservation.interface';
import { HotelRoomService } from '../hotels/hotel-room.service';

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    private hotelRoomService: HotelRoomService,
  ) {}

  async addReservation(data: ReservationDto): Promise<ReservationDocument> {
    const room = await this.hotelRoomService.findById(data.roomId);
    if (!room || !room.isEnabled) {
      throw new BadRequestException('Неверный номер комнаты');
    }

    await this.removeExpiredReservations();

    data.hotelId = room.hotel.toString();
    const conflict = await this.reservationModel.findOne({
      roomId: data.roomId,
      $or: [
        {
          dateStart: { $lte: data.dateEnd },
          dateEnd: { $gte: data.dateStart },
        },
      ],
    });

    if (conflict) {
      throw new BadRequestException('Комната уже забронирована на эти даты');
    }

    const newReservation = new this.reservationModel(data);
    return newReservation.save();
  }

  async removeReservation(id: ID): Promise<void> {
    const res = await this.reservationModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException(`Бронь с id "${id}" не найдена`);
    }
  }

  async removeExpiredReservations(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.reservationModel.deleteMany({
      dateEnd: { $lt: today },
    });
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<ReservationDocument[]> {
    const query: any = {};
    if (filter.userId) query.userId = filter.userId;
    if (filter.roomId) query.roomId = filter.roomId;
    if (filter.dateStart && filter.dateEnd) {
      query.$or = [
        {
          dateStart: { $lte: filter.dateEnd },
          dateEnd: { $gte: filter.dateStart },
        },
      ];
    }

    return this.reservationModel
      .find(query)
      .populate({
        path: 'roomId',
        populate: { path: 'hotel', model: 'Hotel' },
      })
      .exec();
  }

  async getReservationById(id: ID): Promise<ReservationDocument> {
    const reservation = await this.reservationModel
      .findById(id)
      .populate({
        path: 'roomId',
        populate: { path: 'hotel', model: 'Hotel' },
      })
      .exec();
    if (!reservation) {
      throw new NotFoundException(`Бронь с id "${id}" не найдена`);
    }
    return reservation;
  }

  async checkAvailability(
    roomId: ID,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<boolean> {
    const conflict = await this.reservationModel.findOne({
      roomId,
      $or: [
        {
          dateStart: { $lte: dateEnd },
          dateEnd: { $gte: dateStart },
        },
      ],
    });
    return !conflict;
  }

  getFormattedReservations(reservations: ReservationDocument[]) {
    return reservations.map((r) => ({
      id: (r._id as any).toString(),
      startDate: r.dateStart.toISOString().split('T')[0],
      endDate: r.dateEnd.toISOString().split('T')[0],
      hotelRoom: {
        name: (r.roomId as any).name,
        description: (r.roomId as any).description,
        images: (r.roomId as any).images,
      },
      hotel: {
        title: (r.roomId as any).hotel.title,
        description: (r.roomId as any).hotel.description,
      },
    }));
  }
}
