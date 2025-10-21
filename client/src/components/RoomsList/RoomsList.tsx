import { useState, useEffect } from 'react';
import RoomCard from '../RoomCard/RoomCard';
import Pagination from '../Pagination/Pagination';
import { getAllRooms } from '../../api/hotels.service';
import type { HotelRoom } from '../../api/hotels.service';

type RoomsListProps = {
  query: string;
  showInitially?: boolean;
};

export default function RoomsList({
  query,
  showInitially = true,
}: RoomsListProps) {
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const roomsPerPage = 10;

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true);
        const data = await getAllRooms();
        setRooms(data);
      } catch {
        //ignore
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(
    (room) =>
      room.hotel &&
      (room.name?.toLowerCase().includes(query.toLowerCase()) ||
        room.description?.toLowerCase().includes(query.toLowerCase()) ||
        (room.hotel.title &&
          room.hotel.title.toLowerCase().includes(query.toLowerCase())))
  );

  const shouldShow = showInitially || query.trim().length > 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const start = (currentPage - 1) * roomsPerPage;
  const end = start + roomsPerPage;
  const currentRooms = filteredRooms.slice(start, end);

  if (!shouldShow) return null;
  if (loading) return <p>Загрузка...</p>;

  return (
    <>
      <div className="margin-top-20">
        {currentRooms.map((room) => (
          <RoomCard
            key={room.id!}
            id={room.id!}
            name={room.name}
            description={room.description}
            images={room.images}
            hotel={{
              _id: room.hotel._id,
              title: room.hotel.title,
            }}
          />
        ))}
      </div>

      {filteredRooms.length > roomsPerPage && (
        <Pagination
          totalItems={filteredRooms.length}
          itemsPerPage={roomsPerPage}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </>
  );
}
