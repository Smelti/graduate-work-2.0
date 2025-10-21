import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from '../support-request.schema';
import {
  ISupportRequestClientService,
  CreateSupportRequestDto,
  MarkMessagesAsReadDto,
  ID,
} from '../support-request.interface';

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const supportRequest = new this.supportRequestModel({
      user: data.user,
      createdAt: new Date(),
      messages: [
        {
          author: data.user,
          sentAt: new Date(),
          text: data.text,
        },
      ],
      isActive: true,
    });
    return supportRequest.save();
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
    const supportRequest = await this.supportRequestModel.findById(
      params.supportRequest,
    );
    if (!supportRequest) {
      throw new Error('Запрос в службу поддержки не найден');
    }

    supportRequest.messages.forEach((message) => {
      if (message.author.toString() !== params.user && !message.readAt) {
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
        message.author.toString() !== request.user.toString() &&
        !message.readAt,
    ).length;
  }
}
