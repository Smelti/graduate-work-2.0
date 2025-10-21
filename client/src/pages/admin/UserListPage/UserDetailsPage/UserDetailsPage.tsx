import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getUserById,
  getUserReservations,
  cancelUserReservation,
  type Reservation,
} from '../../../../api/users.service';
import type { User } from '../../../../api/users.service';
import { useAuth } from '../../../../context/AuthContext';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

export default function UserDetailsPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCancelReservation = async (reservationId: string) => {
    if (!id) return;
    try {
      await cancelUserReservation(id, reservationId);
      setReservations(reservations.filter((r) => r.id !== reservationId));
    } catch (error) {
      console.error('Ошибка отмены бронирования:', error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const [userData, reservationsData] = await Promise.all([
          getUserById(id!),
          getUserReservations(id!),
        ]);
        setUser(userData);
        setReservations(reservationsData);
      } catch {
        //ignore
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) return <h2>Загрузка...</h2>;
  if (!user) return <h2>Пользователь не найден</h2>;

  return (
    <div className="users-page card-common">
      <div className="user-header">
        <h1 className="user-name">{user.name}</h1>
        <h2>Бронирования</h2>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Отель</th>
            <th>Номер</th>
            <th>Дата заезда</th>
            <th>Дата выезда</th>
            {(currentUser?.role === 'admin' ||
              currentUser?.role === 'manager') && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {reservations && reservations.length > 0 ? (
            reservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.hotel.title}</td>
                <td>{reservation.hotelRoom.name}</td>
                <td>{formatDate(reservation.startDate)}</td>
                <td>{formatDate(reservation.endDate)}</td>
                {(currentUser?.role === 'admin' ||
                  currentUser?.role === 'manager') && (
                  <td>
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Отменить
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  currentUser?.role === 'admin' ||
                  currentUser?.role === 'manager'
                    ? 5
                    : 4
                }
                style={{ textAlign: 'center', padding: '12px' }}
              >
                Бронирований нет
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
