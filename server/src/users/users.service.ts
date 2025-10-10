/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './users.schema';
import { SearchUserParams } from './users.interfaces';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    data: Partial<User> & { password?: string },
  ): Promise<UserDocument> {
    if (data.password) {
      const hash = await bcrypt.hash(data.password, 10);
      data.passwordHash = hash;
      delete data.password;
    }

    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(params: SearchUserParams): Promise<UserDocument[]> {
    const { limit = 10, offset = 0, email, name, contactPhone } = params;

    const query: any = {};
    if (email) query.email = { $regex: email, $options: 'i' };
    if (name) query.name = { $regex: name, $options: 'i' };
    if (contactPhone)
      query.contactPhone = { $regex: contactPhone, $options: 'i' };

    return this.userModel.find(query).skip(offset).limit(limit).exec();
  }
}
