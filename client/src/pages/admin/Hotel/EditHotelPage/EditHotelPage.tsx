import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HotelForm from '../HotelForm/HotelForm';
import {
  getHotelById,
  updateHotel,
  uploadHotelImages,
} from '../../../../api/hotels.service';
import type { Hotel } from '../../../../api/hotels.service';

export default function EditHotelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    if (!id) return;
    getHotelById(id)
      .then(setHotel)
      .catch(() => {
        // ignore
      });
  }, [id]);

  if (!hotel) return <div>Загрузка...</div>;

  const handleSubmit = async (data: Partial<Hotel> & { files?: File[] }) => {
    try {
      let updatedImages: string[] = [];
      if (data.files && data.files.length > 0) {
        const newImages = await uploadHotelImages(id!, data.files);
        updatedImages = newImages;
      } else {
        updatedImages = (data.images || []).map((img) =>
          img.startsWith('http://localhost:3000/')
            ? img.replace('http://localhost:3000/', '')
            : img
        );
      }
      await updateHotel(id!, {
        title: data.title,
        description: data.description,
        images: updatedImages,
      });
      alert('Отель успешно обновлён!');
      navigate('/hotels');
    } catch {
      alert('Не удалось обновить отель');
    }
  };

  return (
    <HotelForm
      initialData={{
        title: hotel.title,
        description: hotel.description ?? '',
        images: (hotel.images || []).map((img) =>
          img.startsWith('http') ? img : `http://localhost:3000/${img}`
        ),
      }}
      onSubmit={handleSubmit}
    />
  );
}
