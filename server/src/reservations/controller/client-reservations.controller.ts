/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ReservationsService } from '../reservations.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../users/users.schema';
import * as express from 'express';

interface RequestWithUser extends express.Request {
  user?: any;
}

@Controller('api/client/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(UserRole.CLIENT)
  @Post()
  async create(
    @Body() body: { hotelRoom: string; startDate: string; endDate: string },
    @Req() req: RequestWithUser,
  ) {
    const reservation = await this.reservationsService.addReservation({
      userId: req.user.userId,
      hotelId: '',
      roomId: body.hotelRoom,
      dateStart: new Date(body.startDate),
      dateEnd: new Date(body.endDate),
    });

    const populated = await this.reservationsService.getReservationById(
      (reservation as any)._id.toString(),
    );
    return this.reservationsService.getFormattedReservations([populated])[0];
  }

  @Roles(UserRole.CLIENT)
  @Get()
  async getUserReservations(@Req() req: RequestWithUser) {
    const reservations = await this.reservationsService.getReservations({
      userId: req.user.userId,
    });
    return this.reservationsService.getFormattedReservations(reservations);
  }

  @Roles(UserRole.CLIENT)
  @Delete(':id')
  async cancel(@Param('id') id: string, @Req() req: RequestWithUser) {
    const reservation = await this.reservationsService.getReservationById(id);
    if (reservation.userId.toString() !== req.user.userId) {
      throw new ForbiddenException('Нет доступа к этой броне');
    }
    await this.reservationsService.removeReservation(id);
  }

  @Roles(UserRole.CLIENT)
  @Get('check-availability/:roomId')
  async checkAvailability(
    @Param('roomId') roomId: string,
    @Query('dateStart') dateStart: string,
    @Query('dateEnd') dateEnd: string,
  ) {
    const available = await this.reservationsService.checkAvailability(
      roomId,
      new Date(dateStart),
      new Date(dateEnd),
    );
    return { available };
  }

  @Roles(UserRole.CLIENT)
  @Get('room-reservations/:roomId')
  async getRoomReservations(@Param('roomId') roomId: string) {
    const reservations = await this.reservationsService.getReservations({
      roomId,
    });
    return reservations.map((r) => ({
      startDate: r.dateStart.toISOString().split('T')[0],
      endDate: r.dateEnd.toISOString().split('T')[0],
    }));
  }
}
