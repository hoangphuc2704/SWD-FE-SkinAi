import React from 'react';
import classNames from 'classnames/bind';
import styles from '../Admin.module.scss';
const cx = classNames.bind(styles);

function ManageUsers({ users, searchUser, setSearchUser, currentPageUsers, setCurrentPageUsers }) {
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
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Gói</th>
              <th>Lượt phân tích</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={cx('badge', 'premium')}>{user.package}</span>
                </td>
                <td>{user.scans}</td>
                <td>
                  <span className={cx('badge', user.status)}>
                    {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td>{user.joinDate}</td>
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
        <button disabled={currentPageUsers === 1}>Trước</button>
        <button className={cx('active')}>1</button>
        <button>2</button>
        <button>3</button>
        <button>Sau</button>
      </div>
    </div>
  );
}

export default ManageUsers;
