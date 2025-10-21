/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { createReservation, checkRoomAvailability, getRoomReservations } from '../../../../api/reservations.service';
import type { HotelRoom } from '../../../../api/hotels.service';
import CustomCalendar from '../../../Home/Main/Calendar';
import './ModalReservation.css';

type ModalReservationProps = {
  room: HotelRoom;
  onClose: () => void;
};

export default function ModalReservation({ room, onClose }: ModalReservationProps) {
  const [bookingDates, setBookingDates] = useState({
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [reservedDates, setReservedDates] = useState<{ startDate: string; endDate: string }[]>([]);
  const [calendarDates, setCalendarDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [reservedDateObjects, setReservedDateObjects] = useState<Date[]>([]);

  useEffect(() => {
    const loadReservedDates = async () => {
      try {
        const reservations = await getRoomReservations(room.id || room._id || '');
        setReservedDates(reservations);

        const dateObjects: Date[] = [];
        reservations.forEach(res => {
          const start = new Date(res.startDate);
          const end = new Date(res.endDate);
          const current = new Date(start);
          while (current <= end) {
            dateObjects.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
        setReservedDateObjects(dateObjects);
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    };
    loadReservedDates();
  }, [room]);

  useEffect(() => {
    if (bookingDates.startDate && bookingDates.endDate) {
      checkAvailability();
    } else {
      setIsAvailable(null);
    }
  }, [bookingDates.startDate, bookingDates.endDate]);

  const checkAvailability = async () => {
    setCheckingAvailability(true);
    try {
      const available = await checkRoomAvailability(
        room.id || room._id || '',
        bookingDates.startDate,
        bookingDates.endDate,
      );
      setIsAvailable(available);
    } catch {
      setIsAvailable(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDates.startDate || !bookingDates.endDate) {
      alert('Пожалуйста, выберите даты');
      return;
    }

    setLoading(true);
    try {
      await createReservation({
        hotelRoom: room.id || room._id || '',
        startDate: bookingDates.startDate,
        endDate: bookingDates.endDate,
      });
      alert('Бронь создана успешно!');
      onClose();
    } catch {
      alert('Ошибка при создании брони');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Забронировать номер</h2>
        <p>{room.name || 'Без названия'}</p>
        <div className="calendar-section">
          <h3>Выберите даты бронирования</h3>
          <CustomCalendar
            startDate={calendarDates.start}
            endDate={calendarDates.end}
            reservedDates={reservedDateObjects}
            onChange={(dates) => {
              setCalendarDates(dates);
              setBookingDates({
                startDate: dates.start ? dates.start.toISOString().split('T')[0] : '',
                endDate: dates.end ? dates.end.toISOString().split('T')[0] : '',
              });
            }}
          />
          <div className="reserved-dates">
            <h4>Занятые даты:</h4>
            <ul>
              {reservedDates.map((res, index) => (
                <li key={index}>
                  {res.startDate} - {res.endDate}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Дата заезда:</label>
            <input
              type="date"
              value={bookingDates.startDate}
              onChange={(e) =>
                setBookingDates({ ...bookingDates, startDate: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Дата выезда:</label>
            <input
              type="date"
              value={bookingDates.endDate}
              onChange={(e) =>
                setBookingDates({ ...bookingDates, endDate: e.target.value })
              }
              required
            />
          </div>
          {bookingDates.startDate && bookingDates.endDate && (
            <div className="availability-status">
              {checkingAvailability ? (
                <p>Проверка доступности...</p>
              ) : isAvailable === true ? (
                <p className="available">Номер доступен на выбранные даты</p>
              ) : isAvailable === false ? (
                <p className="not-available">Номер занят на выбранные даты</p>
              ) : null}
            </div>
          )}
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Отмена
            </button>
            <button type="submit" disabled={loading || isAvailable === false}>
              {loading ? 'Создание...' : 'Забронировать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
