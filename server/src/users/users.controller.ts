import {
  Controller,
  Get,
  Post,
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

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
