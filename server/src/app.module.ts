import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationsModule } from './reservations/reservations.module';
import { SupportRequestModule } from './support-requests/support-request.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/hotel-db'),
    UsersModule,
    AuthModule,
    HotelsModule,
    ReservationsModule,
    SupportRequestModule,
  ],
})
export class AppModule {}
