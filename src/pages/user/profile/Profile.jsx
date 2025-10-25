import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { getProfile, updateProfile } from '../../../apis/userApi';
const cx = classNames.bind(styles);

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data.data);
        setEditedProfile(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
    setError(null);
  };

  const handleChange = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await updateProfile(editedProfile);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={cx('loading')}>Đang tải...</div>;
  if (!profile) return <div className={cx('error')}>Không có dữ liệu profile</div>;

  return (
    <div className={cx('profile')}>
      <div className={cx('header')}>
        <h2>Thông tin cá nhân</h2>
        {!isEditing ? (
          <button className={cx('btn-edit')} onClick={handleEdit}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Chỉnh sửa
          </button>
        ) : (
          <div className={cx('btn-group')}>
            <button className={cx('btn-save')} onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button className={cx('btn-cancel')} onClick={handleCancel} disabled={saving}>
              Hủy
            </button>
          </div>
        )}
      </div>

      {error && <div className={cx('error-message')}>{error}</div>}

      <div className={cx('profile-content')}>
        <div className={cx('field')}>
          <label>Họ tên:</label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={cx('input')}
            />
          ) : (
            <span>{profile.fullName}</span>
          )}
        </div>

        <div className={cx('field')}>
          <label>Email:</label>
          <span className={cx('readonly')}>{profile.email}</span>
        </div>

        <div className={cx('field')}>
          <label>Loại da:</label>
          {isEditing ? (
            <select
              value={editedProfile.skinType || ''}
              onChange={(e) => handleChange('skinType', e.target.value)}
              className={cx('input')}
            >
              <option value="">Chọn loại da</option>
              <option value="da dầu">Da dầu</option>
              <option value="da khô">Da khô</option>
              <option value="da hỗn hợp">Da hỗn hợp</option>
              <option value="da thường">Da thường</option>
              <option value="da nhạy cảm">Da nhạy cảm</option>
            </select>
          ) : (
            <span>{profile.skinType}</span>
          )}
        </div>

        <div className={cx('field')}>
          <label>Trạng thái:</label>
          <span className={cx('readonly')}>{profile.status}</span>
        </div>

        <div className={cx('field')}>
          <label>Ngày sinh:</label>
          {isEditing ? (
            <input
              type="date"
              value={editedProfile.dateOfBirth || ''}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className={cx('input')}
            />
          ) : (
            <span>{profile.dateOfBirth}</span>
          )}
        </div>

        <div className={cx('field')}>
          <label>Role ID:</label>
          <span className={cx('readonly')}>{profile.roleId}</span>
        </div>

        {profile.googleId && (
          <div className={cx('field')}>
            <label>Google ID:</label>
            <span className={cx('readonly')}>{profile.googleId}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
