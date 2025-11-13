import React from 'react';
import classNames from 'classnames/bind';
import styles from '../Admin.module.scss';
import Button from '../../../components/button/Button';
const cx = classNames.bind(styles);

function ManagePackages({
  packages,
  searchPackage,
  setSearchPackage,
  currentPagePackages,
  setCurrentPagePackages,
}) {
  return (
    <div className={cx('tableCard')}>
      <div className={cx('tableHeader')}>
        <h3>Quản lý gói dịch vụ</h3>
        <div className={cx('searchBox')}>
          <input
            type="text"
            placeholder="Tìm kiếm gói"
            value={searchPackage}
            onChange={(e) => setSearchPackage(e.target.value)}
          />
          <Button>Thêm mới</Button>
        </div>
      </div>

      <div className={cx('tableWrapper')}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên gói</th>
              <th>Giá</th>
              <th>Số lượt chat</th>
              <th>Tính năng</th>
              <th>Số người dùng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((packagee) => (
              <tr key={packagee.id}>
                <td>{packagee.id}</td>
                <td>
                  <strong>{packagee.name}</strong>
                </td>
                <td>{packagee.price}</td>
                <td>{packagee.chats}</td>
                <td>{packagee.features}</td>
                <td>{packagee.users}</td>
                <td>
                  <span className={cx('badge', 'active')}>Hoạt động</span>
                </td>
                <td>
                  <div className={cx('actions')}>
                    <Button className={cx('view')}>Xem</Button>
                    <Button className={cx('edit')}>Sửa</Button>
                    <Button className={cx('delete')}>Xóa</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={cx('pagination')}>
        <button disabled={currentPagePackages === 1}>Trước</button>
        <button className={cx('active')}>1</button>
        <button>Sau</button>
      </div>
    </div>
  );
}

export default ManagePackages;
