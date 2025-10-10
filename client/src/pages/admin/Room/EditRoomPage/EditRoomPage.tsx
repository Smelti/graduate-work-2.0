import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RoomForm from '../RoomForm/RoomForm';
import { getAllRooms, updateRoom } from '../../../../api/hotels.service';
import type { HotelRoom } from '../../../../api/hotels.service';

export default function EditRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<HotelRoom | null>(null);

  useEffect(() => {
    getAllRooms().then((rooms) => {
      const found = rooms.find((r) => r.id === roomId);
      setRoom(found || null);
    });
  }, [roomId]);

  if (!room) return <div>Загрузка...</div>;

  const handleSubmit = async (
    data: Partial<HotelRoom> & { files?: File[] }
  ) => {
    try {
      await updateRoom(roomId!, { ...data, hotel: room.hotel });
      alert('Комната успешно обновлена!');
      navigate(`/rooms/${room.hotel._id}`);
    } catch {
      // ignore
      alert('Не удалось обновить комнату');
    }
  };

  return (
    <RoomForm
      initialData={{
        name: room.name || '',
        description: room.description || '',
        images: (room.images || []).map((img) =>
          img.startsWith('http') ? img : `http://localhost:3000/${img}`
        ),
        hotel: room.hotel,
      }}
      onSubmit={handleSubmit}
    />
  );
}
