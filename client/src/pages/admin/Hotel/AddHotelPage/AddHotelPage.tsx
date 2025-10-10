import { useNavigate } from 'react-router-dom';
import HotelForm from '../HotelForm/HotelForm';
import {
  createHotel,
  uploadHotelImages,
  updateHotel,
  Hotel,
} from '../../../../api/hotels.service';

export default function AddHotelPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: Partial<Hotel> & { files?: File[] }) => {
    try {
      const created = await createHotel({
        title: data.title,
        description: data.description,
      });

      if (data.files && data.files.length > 0 && created.id) {
        const uploadedUrls = await uploadHotelImages(created.id, data.files);
        await updateHotel(created.id, { images: uploadedUrls });
      }

      alert('Отель успешно добавлен!');
      navigate('/hotels');
    } catch (error) {
      console.error('Ошибка при добавлении отеля:', error);
      alert('Не удалось добавить отель');
    }
  };

  return (
    <HotelForm
      initialData={{ title: '', description: '', images: [] }}
      onSubmit={handleSubmit}
    />
  );
}
