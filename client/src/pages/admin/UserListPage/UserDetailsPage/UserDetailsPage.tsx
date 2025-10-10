import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserById } from '../../../../api/users.service';
import type { User } from '../../../../api/users.service';

interface Booking {
  _id: string;
  hotelName: string;
  dateFrom: string;
  dateTo: string;
}

interface UserWithBookings extends User {
  bookings?: Booking[];
}

export default function UserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState<UserWithBookings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUserById(id!);
        setUser(data);
      } catch {
        // Remove console.error for production
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) return <h2>Загрузка...</h2>;
  if (!user) return <h2>Пользователь не найден</h2>;

  return (
    <div className="users-page">
      <h1 className="user-name">{user.name}</h1>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID брони</th>
            <th>Отель</th>
            <th>Дата заезда</th>
            <th>Дата выезда</th>
          </tr>
        </thead>
        <tbody>
          {user.bookings && user.bookings.length > 0 ? (
            user.bookings.map((booking: Booking) => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.hotelName}</td>
                <td>{booking.dateFrom}</td>
                <td>{booking.dateTo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '12px' }}>
                Бронирований нет
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
