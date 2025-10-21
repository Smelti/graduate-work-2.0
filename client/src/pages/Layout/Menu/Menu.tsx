import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Menu.css';

export default function Menu() {
  const { user } = useAuth();

  return (
    <div className="menu">
      <nav>
        <Link to="/hotels" className="menu-item">
          Все Гостиницы
        </Link>
        <Link to="/rooms" className="menu-item">
          Поиск Номера
        </Link>

        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Link to="/add-hotel" className="menu-item">
            Добавить гостиницу
          </Link>
        )}

        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Link to="/users" className="menu-item">
            Пользователи
          </Link>
        )}
      </nav>
    </div>
  );
}
