import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersSeeder } from './users.seeder';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ReservationsModule,
  ],
  providers: [UsersService, UsersSeeder],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
