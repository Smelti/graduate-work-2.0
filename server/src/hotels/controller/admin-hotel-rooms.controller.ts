import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { HotelRoomService } from '../hotel-room.service';
import { CreateHotelRoomDto } from '../dto/create-hotel-room.dto';
import { UpdateHotelRoomDto } from '../dto/update-hotel-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRole } from 'src/users/users.schema';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/admin/hotel-rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminHotelRoomsController {
  constructor(private readonly roomService: HotelRoomService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/rooms',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateHotelRoomDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const images = (files ?? []).map((f) => `uploads/rooms/${f.filename}`);

    try {
      const room = await this.roomService.create(dto, images);

      return room;
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }

  @Roles(UserRole.ADMIN)
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/rooms',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(@Param('id') id: string, @Body() dto: UpdateHotelRoomDto) {
    try {
      const updatedRoom = await this.roomService.update(id, dto);
      return updatedRoom;
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.roomService.remove(id);
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Неизвестная ошибка');
    }
  }
}
