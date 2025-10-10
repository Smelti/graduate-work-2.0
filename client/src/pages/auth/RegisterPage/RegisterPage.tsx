import { useState } from 'react';
import { register } from '../../../api/auth.service';
import './RegisterPage.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        name,
        email,
        contactPhone: phone,
        password,
      });
      alert('Регистрация успешна! Теперь войдите в систему.');
    } catch {
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className="main">
      <div className="register-main">
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="required-field">
            <label htmlFor="name">
              <p>Введите ваше имя: </p>
              <input
                className="modal-inp"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>

          <div className="required-field">
            <label htmlFor="email">
              <p>Email: </p>
              <input
                className="modal-inp"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>

          <div className="required-field">
            <label htmlFor="phone">
              <p>Номер телефона: </p>
              <input
                className="modal-inp"
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>

          <div className="required-field">
            <label htmlFor="password">
              <p>Пароль: </p>
              <input
                className="modal-inp"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <button type="submit" className="register-btn">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}
