import axios from 'axios';

const API_URL = 'http://localhost:3000/api/client/support-requests';

export interface SupportRequest {
  _id: string;
  user: {
    name: string;
  };
  createdAt: string;
  messages: Message[];
  isActive: boolean;
}

export interface Message {
  _id: string;
  author: {
    _id: string;
    name: string;
  };
  sentAt: string;
  text: string;
  readAt?: string;
}

export interface CreateSupportRequestData {
  text: string;
}

export async function createSupportRequest(
  data?: CreateSupportRequestData
): Promise<SupportRequest> {
  const token = localStorage.getItem('token');
  const res = await axios.post<SupportRequest>(API_URL, data || {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function sendMessage(
  supportRequestId: string,
  text: string
): Promise<Message> {
  const token = localStorage.getItem('token');
  const res = await axios.post<Message>(
    `${API_URL}/${supportRequestId}/messages`,
    { text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function getSupportRequests(): Promise<SupportRequest[]> {
  const token = localStorage.getItem('token');
  const res = await axios.get<SupportRequest[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getMessages(
  supportRequestId: string
): Promise<Message[]> {
  const token = localStorage.getItem('token');
  const res = await axios.get<Message[]>(
    `${API_URL}/${supportRequestId}/messages`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function markMessagesAsRead(
  supportRequestId: string,
  createdBefore: string
): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.put(
    `${API_URL}/${supportRequestId}/messages/read`,
    { createdBefore },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function getUnreadCount(
  supportRequestId: string
): Promise<number> {
  const token = localStorage.getItem('token');
  const res = await axios.get<{ count: number }>(
    `${API_URL}/${supportRequestId}/unread`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data.count;
}
