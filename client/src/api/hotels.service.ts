import axios from 'axios';

const COMMON_API = 'http://localhost:3000/api/common/hotels';
const ADMIN_API = 'http://localhost:3000/api/admin/hotels';
const COMMON_ROOMS_API = 'http://localhost:3000/api/common/hotel-rooms';
const ADMIN_ROOMS_API = 'http://localhost:3000/api/admin/hotel-rooms';

export interface HotelRoom {
  _id?: string;
  id?: string;
  hotel: { _id: string; title: string };
  description?: string;
  images?: string[];
  isEnabled?: boolean;
  name?: string;
}

export interface Hotel {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  images?: string[];
  isEnabled?: boolean;
}

export async function getHotels(): Promise<Hotel[]> {
  const res = await axios.get<Hotel[]>(COMMON_API);
  return res.data;
}

export async function getHotelById(hotelId: string): Promise<Hotel> {
  const res = await axios.get<Hotel>(`${COMMON_API}/${hotelId}`);
  return res.data;
}

export async function createHotel(data: Partial<Hotel>) {
  const token = localStorage.getItem('token');
  const res = await axios.post<Hotel>(ADMIN_API, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateHotel(hotelId: string, data: Partial<Hotel>) {
  const token = localStorage.getItem('token');
  const res = await axios.put<Hotel>(`${ADMIN_API}/${hotelId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteHotel(hotelId: string) {
  const token = localStorage.getItem('token');
  await axios.delete(`${ADMIN_API}/${hotelId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getRoomsByHotel(hotelId: string): Promise<HotelRoom[]> {
  const res = await axios.get<HotelRoom[]>(
    `${COMMON_ROOMS_API}?hotel=${hotelId}`
  );
  return res.data;
}

export async function getAllRooms(): Promise<HotelRoom[]> {
  const res = await axios.get<HotelRoom[]>(COMMON_ROOMS_API);
  return res.data;
}

export async function createRoom(data: Partial<HotelRoom>) {
  const token = localStorage.getItem('token');
  const res = await axios.post<HotelRoom>(ADMIN_ROOMS_API, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateRoom(
  roomId: string,
  data: Partial<HotelRoom> & { files?: File[] }
) {
  const token = localStorage.getItem('token');
  const strippedImages = (data.images || []).map((img) =>
    img.startsWith('http://localhost:3000/')
      ? img.replace('http://localhost:3000/', '')
      : img
  );
  let updatedImages = strippedImages;
  if (data.files && data.files.length > 0) {
    const newImages = await uploadRoomImages(roomId, data.files);
    updatedImages = [...updatedImages, ...newImages];
  }
  const updateData = {
    name: data.name,
    description: data.description,
    images: updatedImages,
    ...(data.hotel && { hotelId: data.hotel._id }),
  };

  const res = await axios.put<HotelRoom>(
    `${ADMIN_ROOMS_API}/${roomId}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function deleteRoom(roomId: string) {
  const token = localStorage.getItem('token');
  await axios.delete(`${ADMIN_ROOMS_API}/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function uploadHotelImages(
  hotelId: string,
  files: File[]
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const token = localStorage.getItem('token');
  const res = await axios.post<{ images: string[] }>(
    `http://localhost:3000/api/admin/upload/hotel/${hotelId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.images;
}

export async function uploadRoomImages(
  roomId: string,
  files: File[]
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const token = localStorage.getItem('token');
  const res = await axios.post<{ images: string[] }>(
    `http://localhost:3000/api/admin/upload/room/${roomId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.images;
}
