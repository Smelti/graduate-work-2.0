import axios from 'axios';

const API_URL = 'http://localhost:3000/api/manager/support-requests';

export interface SupportRequest {
  id: string;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
  client: {
    id: string;
    name: string;
    email: string;
    contactPhone?: string;
  };
}

export interface Message {
  id: string;
  createdAt: string;
  text: string;
  readAt?: string;
  author: {
    id: string;
    name: string;
  };
}

export async function getManagerSupportRequests(
  limit?: number,
  offset?: number,
  isActive?: boolean,
): Promise<SupportRequest[]> {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();
  if (limit !== undefined) params.append('limit', limit.toString());
  if (offset !== undefined) params.append('offset', offset.toString());
  if (isActive !== undefined) params.append('isActive', isActive.toString());

  const res = await axios.get<SupportRequest[]>(
    `${API_URL}?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

export async function sendManagerMessage(
  supportRequestId: string,
  text: string,
): Promise<Message> {
  const token = localStorage.getItem('token');
  const res = await axios.post<Message>(
    `${API_URL}/${supportRequestId}/messages`,
    { text },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

export async function getManagerMessages(
  supportRequestId: string,
): Promise<Message[]> {
  const token = localStorage.getItem('token');
  const res = await axios.get<Message[]>(
    `${API_URL}/${supportRequestId}/messages`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

export async function markManagerMessagesAsRead(
  supportRequestId: string,
  createdBefore: string,
): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.put(
    `${API_URL}/${supportRequestId}/messages/read`,
    { createdBefore },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

export async function getManagerUnreadCount(
  supportRequestId: string,
): Promise<number> {
  const token = localStorage.getItem('token');
  const res = await axios.get<{ count: number }>(
    `${API_URL}/${supportRequestId}/unread`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data.count;
}

export async function closeManagerSupportRequest(
  supportRequestId: string,
): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.post(
    `${API_URL}/${supportRequestId}/close`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}
