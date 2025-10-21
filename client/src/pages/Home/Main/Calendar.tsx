import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import { ru } from 'date-fns/locale';
registerLocale('ru', ru);

interface CalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: { start: Date | null; end: Date | null }) => void;
  reservedDates?: Date[];
}

export default function CustomCalendar({
  startDate,
  endDate,
  onChange,
  reservedDates = [],
}: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <DatePicker
      selected={startDate}
      onChange={(dates) => {
        const [start, end] = dates as [Date | null, Date | null];
        onChange({ start, end });
      }}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      inline
      locale="ru"
      className="custom-input"
      calendarClassName="custom-calendar margin-top-20"
      excludeDates={reservedDates}
      minDate={today}
      dayClassName={(date) => {
        if (reservedDates.some(reservedDate =>
          date.toDateString() === reservedDate.toDateString()
        )) {
          return 'reserved-day';
        }
        return '';
      }}
    />
  );
}
