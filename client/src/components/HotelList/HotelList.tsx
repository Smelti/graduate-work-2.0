import { useState, useEffect } from 'react';
import HotelCard from '../HotelCard/HotelCard';
import Pagination from '../Pagination/Pagination';
import { filterHotels } from './FilterHotels';
import { getHotels, Hotel } from '../../api/hotels.service';
import './HotelList.css';

type HotelListProps = {
  query: string;
  startDate: Date | null;
  endDate: Date | null;
  showInitially?: boolean;
  filterByAvailability?: boolean;
};

export default function HotelList({
  query,
  startDate,
  endDate,
  showInitially = true,
  filterByAvailability = false,
}: HotelListProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const hotelsPerPage = 5;

  useEffect(() => {
    async function fetchAndFilterHotels() {
      try {
        const data = await getHotels();
        let filtered = data;
        if (filterByAvailability) {
          filtered = await filterHotels(data, query, startDate, endDate);
        } else {
          const lowerQuery = query.toLowerCase();
          filtered = data.filter((hotel) =>
            hotel.title?.toLowerCase().includes(lowerQuery) ||
            hotel.description?.toLowerCase().includes(lowerQuery)
          );
        }
        setHotels(filtered);
      } catch (err) {
        console.error('Ошибка при загрузке отелей:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAndFilterHotels();
  }, [query, startDate, endDate, filterByAvailability]);

  const shouldShow =
    showInitially || query.trim().length > 0 || startDate || endDate;

  useEffect(() => {
    setCurrentPage(1);
  }, [query, startDate, endDate]);

  const start = (currentPage - 1) * hotelsPerPage;
  const end = start + hotelsPerPage;
  const currentHotels = hotels.slice(start, end);

  if (!shouldShow) return null;
  if (loading) return <p>Загрузка отелей...</p>;

  return (
    <>
      <div className="hotel-list">
        {currentHotels.length > 0 ? (
          currentHotels.map((hotel) => {
            const images = hotel.images?.length
              ? hotel.images.map((img: string) =>
                  img.startsWith('http') ? img : `http://localhost:3000/${img}`
                )
              : ['no-image.jpg'];

            return (
              <div key={hotel._id || hotel.id}>
                <HotelCard
                  id={hotel._id || hotel.id || ''}
                  images={images}
                  name={hotel.title}
                  shortDescription={hotel.description || 'Описание недоступно.'}
                />

              </div>
            );
          })
        ) : (
          <p>Отелей не найдено.</p>
        )}
      </div>

      {hotels.length > hotelsPerPage && (
        <Pagination
          totalItems={hotels.length}
          itemsPerPage={hotelsPerPage}
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
