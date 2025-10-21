/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SupportRequestService } from '../service/support-request.service';
import { SupportRequestEmployeeService } from '../service/support-request-employee.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../users/users.schema';
import {
  SendMessageDto,
  MarkMessagesAsReadDto,
} from '../support-request.interface';
import * as express from 'express';

interface RequestWithUser extends express.Request {
  user?: { userId: string };
}

@Controller('api/manager/support-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ManagerSupportRequestsController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @Roles(UserRole.MANAGER)
  @Get()
  async getSupportRequests(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('isActive') isActive?: string,
  ) {
    const params = {
      user: null,
      isActive: isActive === 'false' ? false : undefined,
    };
    const requests =
      await this.supportRequestService.findSupportRequests(params);
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    let result = requests;
    if (offsetNum) result = result.slice(offsetNum);
    if (limitNum) result = result.slice(0, limitNum);

    return result.map((req) => ({
      id: (req as any)._id.toString(),
      createdAt: req.createdAt.toISOString(),
      isActive: req.isActive,
      hasNewMessages: req.messages.some(
        (msg) => msg.author.toString() !== req.user.toString() && !msg.readAt,
      ),
      client: {
        id: req.user.toString(),
        name: (req.user as any)?.name,
        email: (req.user as any)?.email,
        contactPhone: (req.user as any)?.contactPhone,
      },
    }));
  }

  @Roles(UserRole.MANAGER)
  @Post(':id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body() body: { text: string },
    @Req() req: RequestWithUser,
  ) {
    const data: SendMessageDto = {
      author: req.user!.userId,
      supportRequest: id,
      text: body.text,
    };
    const message = await this.supportRequestService.sendMessage(data);
    return {
      id: (message as any)._id?.toString(),
      createdAt: message.sentAt.toISOString(),
      text: message.text,
      readAt: message.readAt?.toISOString(),
      author: {
        id: message.author.toString(),
        name: (message.author as any)?.name,
      },
    };
  }

  @Roles(UserRole.MANAGER)
  @Put(':id/messages/read')
  async markMessagesAsRead(
    @Param('id') id: string,
    @Body() body: { createdBefore: string },
    @Req() req: RequestWithUser,
  ) {
    const params: MarkMessagesAsReadDto = {
      user: req.user!.userId,
      supportRequest: id,
      createdBefore: new Date(body.createdBefore),
    };
    await this.supportRequestEmployeeService.markMessagesAsRead(params);
    return { success: true };
  }

  @Roles(UserRole.MANAGER)
  @Get(':id/unread')
  async getUnreadCount(@Param('id') id: string) {
    const count = await this.supportRequestEmployeeService.getUnreadCount(id);
    return { count };
  }

  @Roles(UserRole.MANAGER)
  @Get(':id/messages')
  async getMessages(@Param('id') id: string) {
    const request = await this.supportRequestService.getSupportRequestById(id);
    return request.messages
      .map((msg) => ({
        id: (msg as any)._id.toString(),
        createdAt: msg.sentAt.toISOString(),
        text: msg.text,
        readAt: msg.readAt?.toISOString(),
        author: {
          id: (msg.author as any)._id.toString(),
          name: (msg.author as any).name,
        },
      }))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }

  @Roles(UserRole.MANAGER)
  @Post(':id/close')
  async closeRequest(@Param('id') id: string) {
    await this.supportRequestEmployeeService.closeRequest(id);
    return { success: true };
  }
}
