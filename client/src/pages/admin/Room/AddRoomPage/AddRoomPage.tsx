import { useNavigate, useParams } from 'react-router-dom';
import RoomForm from '../RoomForm/RoomForm';
import { HotelRoom } from '../../../../api/hotels.service';
import axios from 'axios';

export default function AddRoomPage() {
  const navigate = useNavigate();
  const { id: hotelId } = useParams<{ id: string }>();

  const handleSubmit = async (
    data: Partial<HotelRoom> & { files?: File[] }
  ) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name || '');
      formData.append('description', data.description || '');
      formData.append('hotelId', hotelId || '');

      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => formData.append('images', file));
      }

      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/admin/hotel-rooms',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Комната успешно добавлена!');
      navigate(`/hotels/${hotelId}`);
    } catch (error) {
      console.error('Ошибка при добавлении комнаты:', error);
      alert('Не удалось добавить комнату');
    }
  };

  return (
    <RoomForm
      initialData={{
        name: '',
        description: '',
        images: [],
        hotel: { _id: hotelId || '', title: '' },
      }}
      onSubmit={handleSubmit}
    />
  );
}
