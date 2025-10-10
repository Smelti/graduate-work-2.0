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
}

export default function CustomCalendar({
  startDate,
  endDate,
  onChange,
}: CalendarProps) {
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
      calendarClassName="custom-calendar"
    />
  );
}
