import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { User, UserRole } from './users.schema';
import { ReservationsService } from '../reservations/reservations.service';

@Controller('api')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @Post('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() body: Partial<User>) {
    return this.usersService.create(body);
  }

  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllAdmin(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('contactPhone') contactPhone?: string,
  ) {
    return this.usersService.findAll({
      limit: +limit,
      offset: +offset,
      email,
      name,
      contactPhone,
    });
  }

  @Get('admin/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getByIdAdmin(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('manager/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  async getAllManager(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('contactPhone') contactPhone?: string,
  ) {
    return this.usersService.findAll({
      limit: +limit,
      offset: +offset,
      email,
      name,
      contactPhone,
    });
  }

  @Get('manager/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  async getByIdManager(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('admin/users/:id/reservations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserReservationsAdmin(@Param('id') id: string) {
    const reservations = await this.reservationsService.getReservations({
      userId: id,
    });
    return this.reservationsService.getFormattedReservations(reservations);
  }

  @Get('manager/users/:id/reservations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  async getUserReservationsManager(@Param('id') id: string) {
    const reservations = await this.reservationsService.getReservations({
      userId: id,
    });
    return this.reservationsService.getFormattedReservations(reservations);
  }

  @Delete('admin/users/:userId/reservations/:reservationId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async cancelUserReservationAdmin(
    @Param('userId') userId: string,
    @Param('reservationId') reservationId: string,
  ) {
    const reservation =
      await this.reservationsService.getReservationById(reservationId);
    if (reservation.userId.toString() !== userId) {
      throw new Error('Бронь не привязана к  пользователю');
    }
    await this.reservationsService.removeReservation(reservationId);
  }

  @Delete('manager/users/:userId/reservations/:reservationId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  async cancelUserReservationManager(
    @Param('userId') userId: string,
    @Param('reservationId') reservationId: string,
  ) {
    const reservation =
      await this.reservationsService.getReservationById(reservationId);
    if (reservation.userId.toString() !== userId) {
      throw new Error('Бронь не привязана к пользователю');
    }
    await this.reservationsService.removeReservation(reservationId);
  }
}
