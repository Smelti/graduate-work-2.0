import { useState } from 'react';
import HotelList from '../../../components/HotelList/HotelList';
import './HotelPage.css';

export default function AllHotelsPage() {
  const [query, setQuery] = useState<string>('');

  return (
    <>
      <div className="header-hotels-page card-common">
        <h1>Все гостиницы</h1>
        <input
          type="text"
          className="search-hotels"
          placeholder="Введите название гостиницы"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <HotelList query={query} startDate={null} endDate={null} />
    </>
  );
}
