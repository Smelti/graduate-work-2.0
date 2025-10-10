import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.schema';

@Controller('api/manager/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ManagerReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(UserRole.MANAGER)
  @Get(':userId')
  async getUserReservations(@Param('userId') userId: string) {
    const reservations = await this.reservationsService.getReservations({
      userId,
    });
    return this.reservationsService.getFormattedReservations(reservations);
  }

  @Roles(UserRole.MANAGER)
  @Delete(':id')
  async cancel(@Param('id') id: string) {
    await this.reservationsService.removeReservation(id);
  }
}
