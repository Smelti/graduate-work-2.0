import { Hotel } from '../../api/hotels.service';
export function filterHotels(
  hotels: Hotel[],
  query: string,
  startDate: Date | null,
  endDate: Date | null
): Hotel[] {
  return hotels.filter((hotel) => {
    const lowerQuery = query.toLowerCase();

    const matchesText =
      hotel.title?.toLowerCase().includes(lowerQuery) ||
      hotel.description?.toLowerCase().includes(lowerQuery);

    if (!startDate || !endDate) {
      return matchesText;
    }

    const matchesDates = true;

    return matchesText && matchesDates;
  });
}
