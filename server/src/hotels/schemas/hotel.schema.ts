import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HotelDocument = HydratedDocument<Hotel>;

@Schema({ timestamps: true })
export class Hotel {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
