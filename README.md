# Hotel Booking App

Дипломный проект: сайт-агрегатор для поиска, просмотра и бронирования гостиниц.

## Описание проекта

Приложение для бронирования гостиниц с регистрацией, входом, просмотром гостиниц/номеров, бронированием, поддержкой и админ-панелью.

## Технологии

- **Frontend**: React, TypeScript, Vite, React Router
- **Backend**: NestJS, MongoDB, Mongoose, JWT, Passport
- **Дополнительно**: Node.js, npm, MongoDB Community Server ([установка](https://docs.mongodb.com/manual/installation/))

## Структура проекта

```
hotel-app/
├── client/          # Фронтенд (React)
│   ├── src/
│   │   ├── components/  # Компоненты
│   │   ├── pages/       # Страницы (auth, admin, user, etc.)
│   │   ├── api/         # API сервисы
│   │   └── router/      # Маршрутизация
├── server/          # Бэкенд (NestJS)
│   ├── src/
│   │   ├── auth/        # Аутентификация
│   │   ├── users/       # Пользователи
│   │   ├── hotels/      # Гостиницы и номера
│   │   ├── reservations/ # Бронирования
│   │   └── support-request/ # Поддержка
│   └── uploads/         # Загруженные файлы
├── package.json     # Зависимости фронтенда
└── README.md        # Этот файл
```

## Установка и запуск

### Требования
- Node.js >= 18
- npm >= 9
- MongoDB (локально на порту 27017)

### Шаги
1. Клонируйте репозиторий: `git clone <URL>`
2. Установите зависимости: `npm install`
3. Запустите MongoDB.
4. Запустите бэкенд: `cd server && npm install && npm run start:dev` (порт 3000)
5. Запустите фронтенд: `npm run dev` (порт 5173)



## Тестирование

- Ручное: Зарегистрируйтесь, войдите, просмотрите гостиницы, протестируйте функции. Для проверки админ-панели используйте: admin@example.com / 123456

