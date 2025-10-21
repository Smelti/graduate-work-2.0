import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from '../support-request.schema';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
  ID,
} from '../support-request.interface';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
  ) {}

  async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
    const supportRequest = await this.supportRequestModel.findById(
      params.supportRequest,
    );
    if (!supportRequest) {
      throw new Error('Запрос в службу поддержки не найден');
    }

    supportRequest.messages.forEach((message) => {
      if (
        message.author.toString() === supportRequest.user.toString() &&
        !message.readAt
      ) {
        message.readAt = new Date();
      }
    });

    await supportRequest.save();
  }

  async getUnreadCount(supportRequest: ID): Promise<number> {
    const request = await this.supportRequestModel.findById(supportRequest);
    if (!request) {
      throw new Error('Запрос в службу поддержки не найден');
    }

    return request.messages.filter(
      (message) =>
        message.author.toString() === request.user.toString() &&
        !message.readAt,
    ).length;
  }

  async closeRequest(supportRequest: ID): Promise<void> {
    const request = await this.supportRequestModel.findById(supportRequest);
    if (!request) {
      throw new Error('Запрос в службу поддержки не найден');
    }

    request.isActive = false;
    await request.save();
  }
}
