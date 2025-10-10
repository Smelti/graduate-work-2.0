import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsService } from './reservations.service';
import { ClientReservationsController } from './client-reservations.controller';
import { ManagerReservationsController } from './manager-reservations.controller';
import { Reservation, ReservationSchema } from './reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  providers: [ReservationsService],
  controllers: [ClientReservationsController, ManagerReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
