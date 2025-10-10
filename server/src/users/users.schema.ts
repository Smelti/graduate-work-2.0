import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  contactPhone?: string;

  @Prop({
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.CLIENT,
  })
  role: UserRole;
}

export type UserDocument = User & Document & { _id: Types.ObjectId };

export const UserSchema = SchemaFactory.createForClass(User);
