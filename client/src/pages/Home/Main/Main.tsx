import './Main.css';
import CustomCalendar from './Calendar';
import { useState } from 'react';

function formatDateInp(date: Date | null) {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

type MainProps = {
  onSearch: (query: string, start: Date | null, end: Date | null) => void;
};

export default function Main({ onSearch }: MainProps) {
  const [query, setQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, startDate, endDate);
  };

  return (
    <div className="main">
      <div className="main-content">
        <h1>Поиск гостиницы</h1>
        <form onSubmit={handleSubmit} className="date-place">
          <div className="input-place">
            <input
              type="text"
              className="info"
              placeholder="Введите название гостиницы (необязательно)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <input
              type="date"
              className="date"
              placeholder="Заезд"
              value={formatDateInp(startDate)}
              onChange={(e) =>
                setStartDate(e.target.value ? new Date(e.target.value) : null)
              }
            />
            <span> - </span>
            <input
              type="date"
              className="date"
              placeholder="Выезд"
              value={formatDateInp(endDate)}
              onChange={(e) =>
                setEndDate(e.target.value ? new Date(e.target.value) : null)
              }
            />
            <CustomCalendar
              startDate={startDate}
              endDate={endDate}
              onChange={({ start, end }) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
          </div>
          <button type="submit">Искать</button>
        </form>
      </div>
    </div>
  );
}
