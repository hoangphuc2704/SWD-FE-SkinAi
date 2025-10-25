import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { getProfile } from '../../../apis/userApi';
const cx = classNames.bind(styles);
function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  if (loading) return <div className={cx('loading')}>Đang tải...</div>;
  if (!profile) return <div className={cx('error')}>Không có dữ liệu profile</div>;
  return (
    <div className={cx('profile')}>
      <h2>Thông tin cá nhân</h2>
      <p>
        <b>Họ tên:</b> {profile.fullName}
      </p>
      <p>
        <b>Email:</b> {profile.email}
      </p>
      <p>
        <b>Loại da:</b> {profile.skinType}
      </p>
      <p>
        <b>Trạng thái:</b> {profile.status}
      </p>
      <p>
        <b>Ngày sinh:</b> {profile.dateOfBirth}
      </p>
      <p>
        <b>Role ID:</b> {profile.roleId}
      </p>
      {profile.googleId && (
        <p>
          <b>Google ID:</b> {profile.googleId}
        </p>
      )}
      {/* Có thể hiển thị thêm các trường khác nếu API trả về */}
    </div>
  );
}

export default Profile;
