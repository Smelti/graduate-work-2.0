import { Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from './Modal/Modal';
import {
  login as loginRequest,
  logout as logoutRequest,
} from '../../../api/auth.service';
import './Header.css';
import { useAuth } from '../../../context/AuthContext';

export default function Header() {
  const { user, login: authLogin, logout: authLogout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    try {
      const data = await loginRequest({ email, password });

      if (!data || !data.access_token) {
        alert('Не удалось войти: сервер не вернул token.');
        console.error('Login response:', data);
        return;
      }
      authLogin(data.user, data.access_token);

      setEmail('');
      setPassword('');
      setIsOpen(false);
    } catch (err) {
      console.error('Ошибка логина:', err);
      alert('Ошибка входа. Проверьте логин/пароль и консоль.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.warn('Ошибка logout на сервере:', err);
    } finally {
      authLogout();
    }
  };

  return (
    <div>
      <header>
        <div className="nav-main">
          <Link to="/" className="nav-main-content">
            Главная
          </Link>
        </div>
        <div className="profile-header">
          {user && <p className="profile-name">{user.name}</p>}
          <div className="profile">
            {user ? (
              <span className="logout" onClick={handleLogout}>
                Выйти
              </span>
            ) : (
              <span className="login" onClick={() => setIsOpen(true)}>
                Войти
              </span>
            )}
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <input
            type="text"
            name="user-email"
            className="modal-inp"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="user-pas"
            className="modal-inp"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="btn-field">
            <button className="log-btn" onClick={handleLogin} type="button">
              Войти
            </button>
            <Link to="/registration">
              <button className="log-btn" type="button">
                Регистрация
              </button>
            </Link>
          </div>
        </Modal>
      </header>
    </div>
  );
}
