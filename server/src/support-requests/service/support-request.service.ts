/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SupportRequest,
  SupportRequestDocument,
  Message,
} from '../support-request.schema';
import {
  ISupportRequestService,
  SendMessageDto,
  GetChatListParams,
  ID,
} from '../support-request.interface';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequestDocument[]> {
    const query: Record<string, unknown> = {};
    if (params.user) query.user = params.user;
    if (params.isActive !== undefined) query.isActive = params.isActive;
    return this.supportRequestModel
      .find(query)
      .populate('user')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllSupportRequests(): Promise<SupportRequestDocument[]> {
    return this.supportRequestModel.find().populate('user').exec();
  }

  async getSupportRequestById(id: string): Promise<SupportRequestDocument> {
    const request = await this.supportRequestModel
      .findById(id)
      .populate('user')
      .populate('messages.author')
      .exec();
    if (!request) {
      throw new Error('Запрос в службу поддержки не найден');
    }
    return request;
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const message = new Message();
    (message as any).author = data.author;
    message.sentAt = new Date();
    message.text = data.text;

    const supportRequest = await this.supportRequestModel.findById(
      data.supportRequest,
    );
    if (!supportRequest) {
      throw new Error('Запрос в службу поддержки не найден');
    }

    supportRequest.messages.push(message);
    await supportRequest.save();

    this.eventEmitter.emit('supportRequest.message', supportRequest, message);

    return message;
  }

  async getMessages(supportRequest: ID): Promise<Message[]> {
    const request = await this.supportRequestModel
      .findById(supportRequest)
      .populate('messages.author')
      .exec();
    if (!request) {
      throw new Error('Запрос в службу поддержки не найден');
    }
    return request.messages;
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    this.eventEmitter.on('supportRequest.message', handler);
    return () => {
      this.eventEmitter.off('supportRequest.message', handler);
    };
  }
}
