import { Hotel } from '../schemas/hotel.schema';
import { CreateHotelDto } from '../dto/create-hotel.dto';

export interface SearchHotelParams {
  limit: number;
  offset: number;
  title?: string;
}

export interface UpdateHotelParams {
  title?: string;
  description?: string;
  images?: string[];
}

export interface IHotelService {
  create(data: CreateHotelDto): Promise<Hotel>;
  findById(id: string): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: string, data: UpdateHotelParams): Promise<Hotel>;
  delete(id: string): Promise<void>;
}
