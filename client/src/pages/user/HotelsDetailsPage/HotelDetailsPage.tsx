import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  getHotels,
  getRoomsByHotel,
  deleteHotel,
  deleteRoom,
} from '../../../api/hotels.service';
import type { Hotel, HotelRoom } from '../../../api/hotels.service';
import ModalReservation from './ModalReservation/ModalReservation';
import './HotelDetailsPage.css';

function getImageUrl(path?: string) {
  if (!path) return '/no-image.jpg';
  return path.startsWith('http') ? path : `http://localhost:3000/${path}`;
}

export default function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);

  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    async function fetchData() {
      try {
        const hotels = await getHotels();
        const foundHotel = hotels.find((h) => h._id === id);
        if (foundHotel && foundHotel._id) {
          setHotel(foundHotel);
          const hotelRooms = await getRoomsByHotel(foundHotel._id);
          setRooms(hotelRooms);
        } else {
          setHotel(null);
          setRooms([]);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleDeleteHotel = async () => {
    if (window.confirm('Вы точно хотите удалить этот отель?')) {
      try {
        await deleteHotel(id!);
        alert('Отель удалён!');
        navigate('/hotels');
      } catch {
        // ignore
        alert('Не удалось удалить отель');
      }
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('Вы точно хотите удалить этот номер?')) {
      try {
        await deleteRoom(roomId);
        alert('Номер удалён!');
        setRooms(rooms.filter((r) => r.id !== roomId));
      } catch {
        // ignore
        alert('Не удалось удалить номер');
      }
    }
  };

  const handleBookRoom = (room: HotelRoom) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  if (loading) return <p>Загрузка...</p>;
  if (!hotel) return <h2>Отель не найден</h2>;

  return (
    <div className="hotel-details">
      <div className="main-card card-common">
        <div className="hotel-images">
          {(hotel.images?.slice(0, 3) || []).map((src, i) => (
            <img
              key={i}
              className="room-img"
              src={getImageUrl(src)}
              alt={`${hotel.title} ${i + 1}`}
            />
          ))}
          {(!hotel.images || hotel.images.length === 0) && (
            <img className="room-img" src="/no-image.jpg" alt={hotel.title} />
          )}
        </div>
        <div className="room-info">
          <h3 className="room-name">{hotel.title}</h3>
          <p className="room-desc">
            {hotel.description || 'Описание недоступно.'}
          </p>
        </div>

        {canEdit && (
          <div className="edit-buttons">
            <Link to={`/hotels/${id}/edit`}>
              <button className="edit-btn">Редактировать отель</button>
            </Link>

            <Link to={`/hotels/${id}/add-room`}>
              <button className="add-btn">Добавить номер</button>
            </Link>

            <button onClick={handleDeleteHotel} className="delete-btn">
              Удалить отель
            </button>
          </div>
        )}
      </div>

      <div className="rooms-section">
        <h3>Номера</h3>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room._id} className="main-card card-common">
              <div className="room-images">
                {(room.images?.slice(0, 3) || []).map((src, i) => (
                  <img
                    key={i}
                    className="room-img"
                    src={getImageUrl(src)}
                    alt={room.description || 'Номер'}
                  />
                ))}
                {(!room.images || room.images.length === 0) && (
                  <img
                    className="room-img"
                    src="/no-image.jpg"
                    alt={room.description || 'Номер'}
                  />
                )}
              </div>
              <div className="room-info">
                <h4 className="room-name">{room.name || 'Без названия'}</h4>
                <p className="room-desc">
                  {room.description || 'Описание недоступно.'}
                </p>
              </div>

              {canEdit && (
                <div className="edit-buttons">
                  <Link to={`/rooms/${room.id}/edit`}>
                    <button className="edit-btn">Редактировать номер</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteRoom(room.id!)}
                    className="delete-btn"
                  >
                    Удалить номер
                  </button>
                </div>
              )}
              {!canEdit && (
                <button
                  onClick={() => handleBookRoom(room)}
                  className="book-btn"
                >
                  Забронировать
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Номеров пока нет.</p>
        )}
      </div>

      {selectedRoom && (
        <ModalReservation room={selectedRoom} onClose={handleCloseModal} />
      )}
    </div>
  );
}
