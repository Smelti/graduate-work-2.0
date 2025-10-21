import Main from './Main/Main';
import HotelList from '../../components/HotelList/HotelList';
import { useState } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (q: string, start: Date | null, end: Date | null) => {
    setQuery(q);
    setStartDate(start);
    setEndDate(end);
    setHasSearched(true);
  };

  return (
    <>
      <Main onSearch={handleSearch} />
      {hasSearched && (
        <HotelList
          query={query}
          startDate={startDate}
          endDate={endDate}
          showInitially={false}
          filterByAvailability={true}
        />
      )}
    </>
  );
}
