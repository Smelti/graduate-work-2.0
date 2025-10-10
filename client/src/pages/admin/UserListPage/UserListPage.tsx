import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/Pagination/Pagination';
import './UserListPage.css';
import { useState, useEffect } from 'react';
import { getUsers } from '../../../api/users.service';
import type { User } from '../../../api/users.service';

export default function UserListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const itemsPerPage = 5;

  useEffect(() => {
    const loadUsers = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole') as
        | 'admin'
        | 'manager'
        | null;
      if (!token || !role) return;

      try {
        const data = await getUsers(role);
        setUsers(data);
        setFilteredUsers(data);
      } catch {
        // ignore
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const q = query.toLowerCase().trim();
    const result = users.filter(
      (u) =>
        u._id.toString().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.contactPhone?.includes(q) ||
        u.email.toLowerCase().includes(q)
    );
    setFilteredUsers(result);
    setCurrentPage(1);
  }, [query, users]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Пользователи</h2>
        <input
          type="text"
          placeholder="Введите имя пользователя, id, телефона или почту"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="users-inp"
        />
      </div>
      <div className="users-info">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user._id}
                  onClick={() => navigate(`/users/${user._id}`)}
                >
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.contactPhone}</td>
                  <td>{user.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: 'center', padding: '12px' }}
                >
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
