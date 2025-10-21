import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SupportRequestClientService } from '../service/support-request-client.service';
import { SupportRequestService } from '../service/support-request.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../users/users.schema';
import {
  CreateSupportRequestDto,
  MarkMessagesAsReadDto,
  SendMessageDto,
} from '../support-request.interface';
import * as express from 'express';

interface RequestWithUser extends express.Request {
  user?: { userId: string };
}

@Controller('api/client/support-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientSupportRequestsController {
  constructor(
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestService: SupportRequestService,
  ) {}

  @Roles(UserRole.CLIENT)
  @Post()
  async create(@Body() body: { text: string }, @Req() req: RequestWithUser) {
    const data: CreateSupportRequestDto = {
      user: req.user!.userId,
      text: body.text,
    };
    return this.supportRequestClientService.createSupportRequest(data);
  }

  @Roles(UserRole.CLIENT)
  @Get()
  async getSupportRequests(@Req() req: RequestWithUser) {
    return this.supportRequestService.findSupportRequests({
      user: req.user!.userId,
    });
  }

  @Roles(UserRole.CLIENT)
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
    return this.supportRequestService.sendMessage(data);
  }

  @Roles(UserRole.CLIENT)
  @Get(':id/messages')
  async getMessages(@Param('id') id: string) {
    return this.supportRequestService.getMessages(id);
  }

  @Roles(UserRole.CLIENT)
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
    await this.supportRequestClientService.markMessagesAsRead(params);
  }

  @Roles(UserRole.CLIENT)
  @Get(':id/unread')
  async getUnreadCount(@Param('id') id: string) {
    return { count: await this.supportRequestClientService.getUnreadCount(id) };
  }
}
