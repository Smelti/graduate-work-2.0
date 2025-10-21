import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsService } from './reservations.service';
import { ClientReservationsController } from './controller/client-reservations.controller';
import { ManagerReservationsController } from './controller/manager-reservations.controller';
import { Reservation, ReservationSchema } from './reservation.schema';
import { HotelsModule } from '../hotels/hotels.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    HotelsModule,
  ],
  providers: [ReservationsService],
  controllers: [ClientReservationsController, ManagerReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
