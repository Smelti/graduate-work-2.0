import RoomsList from '../../../components/RoomsList/RoomsList';
import { useState } from 'react';
import './RoomsPage.css';

export default function RoomsPage() {
  const [query, setQuery] = useState<string>('');

  return (
    <>
      <div className="header-rooms-page card-common">
        <h1>Все номера</h1>
        <input
          type="text"
          className="search-rooms"
          placeholder="Введите описание или название отеля"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <RoomsList query={query} showInitially={true} />
    </>
  );
}
