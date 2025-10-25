import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Admin.module.scss';
import { getUsers } from '../../../apis/userApi';
const cx = classNames.bind(styles);

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    getUsers(currentPage, pageSize)
      .then((data) => {
        console.log('📦 Response from /api/users:', data);
        if (data.data?.items) {
          setUsers(data.data.items);
          setTotalPages(data.data.totalPages || 1);
        } else if (Array.isArray(data.data)) {
          setUsers(data.data);
          setTotalPages(data.totalPages || 1);
        } else if (Array.isArray(data.items)) {
          setUsers(data.items);
          setTotalPages(data.totalPages || 1);
        } else {
          console.warn('⚠️ Unknown response format:', data);
        }
      })
      .catch((err) => console.error('❌ Error fetching users:', err));
  }, [currentPage, pageSize]);

  // Lọc tìm kiếm frontend (tuỳ bạn muốn lọc API hay client)
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className={cx('tableCard')}>
      <div className={cx('tableHeader')}>
        <h3>👥 Quản lý người dùng</h3>
        <div className={cx('searchBox')}>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <button>Tìm kiếm</button>
        </div>
      </div>

      <div className={cx('tableWrapper')}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Loại da</th>
              <th>Trạng thái</th>
              <th>Ngày sinh</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.skinType}</td>
                <td>
                  <span className={cx('badge', user.status)}>
                    {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td>{user.dateOfBirth}</td>
                <td>
                  <div className={cx('actions')}>
                    <button className={cx('view')}>Xem</button>
                    <button className={cx('edit')}>Sửa</button>
                    <button className={cx('delete')}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={cx('pagination')}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((c) => c - 1)}>
          Trước
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={cx({ active: page + 1 === currentPage })}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((c) => c + 1)}>
          Sau
        </button>
      </div>
    </div>
  );
}

export default ManageUsers;
