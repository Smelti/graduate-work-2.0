import axios from 'axios';

const API_URL = 'http://localhost:3000/api/client/reservations';

export interface Reservation {
  startDate: string;
  endDate: string;
  hotelRoom: {
    name: string;
    description: string;
    images: string[];
  };
  hotel: {
    title: string;
    description: string;
  };
}

export interface CreateReservationData {
  hotelRoom: string;
  startDate: string;
  endDate: string;
}

export async function createReservation(data: CreateReservationData): Promise<Reservation> {
  const token = localStorage.getItem('token');
  const res = await axios.post<Reservation>(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getUserReservations(): Promise<Reservation[]> {
  const token = localStorage.getItem('token');
  const res = await axios.get<Reservation[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function cancelReservation(reservationId: string): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/${reservationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function checkRoomAvailability(
  roomId: string,
  dateStart: string,
  dateEnd: string,
): Promise<boolean> {
  const token = localStorage.getItem('token');
  const res = await axios.get<{ available: boolean }>(
    `${API_URL}/check-availability/${roomId}?dateStart=${dateStart}&dateEnd=${dateEnd}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data.available;
}

export async function getRoomReservations(roomId: string): Promise<{ startDate: string; endDate: string }[]> {
  const token = localStorage.getItem('token');
  const res = await axios.get<{ startDate: string; endDate: string }[]>(
    `${API_URL}/room-reservations/${roomId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}
