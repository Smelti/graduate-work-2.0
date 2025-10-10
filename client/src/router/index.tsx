import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/auth/LoginPage/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage/RegisterPage';
import ProfilePage from '../pages/user/ProfilePage/ProfilePage';
import HotelsPage from '../pages/user/HotelsPage/HotelsPage';
import HotelDetailsPage from '../pages/user/HotelsDetailsPage/HotelDetailsPage';
import RoomsPage from '../pages/user/SearchRoomsPage/RoomsPage';
import Layout from '../pages/Layout/Layout';

// 🔹 Админские страницы
import AddHotelPage from '../pages/admin/Hotel/AddHotelPage/AddHotelPage';
import EditHotelPage from '../pages/admin/Hotel/EditHotelPage/EditHotelPage';
import AddRoomPage from '../pages/admin/Room/AddRoomPage/AddRoomPage';
import EditRoomPage from '../pages/admin/Room/EditRoomPage/EditRoomPage';
import UserListPage from '../pages/admin/UserListPage/UserListPage';
import UserDetailsPage from '../pages/admin/UserListPage/UserDetailsPage/UserDetailsPage';

export default function AppRouter() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Главная */}
          <Route path="/" element={<HomePage />} />

          {/* Аутентификация */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegisterPage />} />

          {/* Пользователь */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />

          {/* Админ / менеджер */}
          <Route path="/add-hotel" element={<AddHotelPage />} />
          <Route path="/hotels/:id/edit" element={<EditHotelPage />} />
          <Route path="/hotels/:id/add-room" element={<AddRoomPage />} />
          <Route path="/rooms/:roomId/edit" element={<EditRoomPage />} />

          {/* Пользователи */}
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
