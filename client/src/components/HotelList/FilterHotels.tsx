import { Hotel } from '../../api/hotels.service';
import { getRoomsByHotel } from '../../api/hotels.service';
import { checkRoomAvailability } from '../../api/reservations.service';

export async function filterHotels(
  hotels: Hotel[],
  query: string,
  startDate: Date | null,
  endDate: Date | null
): Promise<Hotel[]> {
  const lowerQuery = query.toLowerCase();

  const filtered = await Promise.all(
    hotels.map(async (hotel) => {
      const matchesText =
        hotel.title?.toLowerCase().includes(lowerQuery) ||
        hotel.description?.toLowerCase().includes(lowerQuery);

      if (!matchesText) return null;

      if (!startDate || !endDate) {
        return hotel;
      }

      try {
        const rooms = await getRoomsByHotel(hotel._id || hotel.id || '');

        const hasAvailableRoom = await Promise.all(
          rooms.map(async (room) => {
            const available = await checkRoomAvailability(
              room.id || room._id || '',
              startDate.toISOString().split('T')[0],
              endDate.toISOString().split('T')[0]
            );
            return available;
          })
        ).then((availabilities) => availabilities.some((avail) => avail));

        if (hasAvailableRoom) return hotel;
      } catch (error) {
        console.error('Ошибка при проверке доступности комнат:', error);
        return hotel;
      }

      return null;
    })
  );

  return filtered.filter((hotel) => hotel !== null) as Hotel[];
}
