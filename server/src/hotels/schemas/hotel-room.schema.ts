import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Hotel } from './hotel.schema';

export type HotelRoomDocument = HydratedDocument<HotelRoom>;

@Schema({ timestamps: true })
export class HotelRoom {
  @Prop({ type: Types.ObjectId, ref: 'Hotel', required: true })
  hotel: Types.ObjectId | Hotel;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ default: true })
  isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
