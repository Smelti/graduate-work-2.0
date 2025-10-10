import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/hotel-db'),
    UsersModule,
    AuthModule,
    HotelsModule,
  ],
})
export class AppModule {}
