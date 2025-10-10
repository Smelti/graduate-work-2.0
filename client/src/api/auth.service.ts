const API_URL = 'http://localhost:3000/api';

function saveToken(token: string) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
}

export async function register(data: {
  email: string;
  password: string;
  name: string;
  contactPhone?: string;
}) {
  const res = await fetch(`${API_URL}/client/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Ошибка регистрации');
  }

  return res.json();
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Неверный email или пароль');
  }

  const json = await res.json();

  if (json.access_token) {
    saveToken(json.access_token);
  } else {
    throw new Error('Сервер не вернул токен');
  }

  return json;
}

export async function logout() {
  clearToken();
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
  });
}
