import { useEffect, useState } from 'react';
import { getUserReservations } from '../../../api/reservations.service';
import type { Reservation } from '../../../api/reservations.service';

export default function ProfilePage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await getUserReservations();
        setReservations(data);
      } catch (error) {
        console.error('Ошибка загрузки бронирований:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="profile-page">
      <h1>Мои бронирования</h1>
      {reservations.length > 0 ? (
        <div className="reservations-list">
          {reservations.map((reservation, index) => (
            <div key={index} className="reservation-card">
              <h3>{reservation.hotel.title}</h3>
              <p>{reservation.hotelRoom.description}</p>
              <p>Заезд: {reservation.startDate}</p>
              <p>Выезд: {reservation.endDate}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>У вас нет бронирований.</p>
      )}
    </div>
  );
}
