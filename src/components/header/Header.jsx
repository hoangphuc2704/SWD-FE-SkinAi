// Header.jsx
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '../../assets/images';
import { Link } from 'react-router-dom';
import Button from '../button/Button';

const cx = classNames.bind(styles);

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className={cx('header')}>
      <div className={cx('header_logo')}>
        <img src={images.logo} alt="Nature Skin AI" />
        <span>Nature Skin AI</span>
      </div>

      <button className={cx('toggle_button')} onClick={openMenu}>
        <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-grip-lines'}`}></i>
      </button>

      <div className={cx('header_nav', { active: isOpen })}>
        <ul className={cx('nav_menu')}>
          <li className={cx('nav_item')}>
            <Link to="/" className={cx('nav_link')} onClick={closeMenu}>
              Trang Chủ
            </Link>
          </li>
          <li className={cx('nav_item')}>
            <Link to="/tu-van-ai" className={cx('nav_link')} onClick={closeMenu}>
              Tư Vấn AI
            </Link>
          </li>
          <li className={cx('nav_item')}>
            <Link to="/quy-trinh" className={cx('nav_link')} onClick={closeMenu}>
              Quy Trình
            </Link>
          </li>
          <li className={cx('nav_item')}>
            <Link to="/ve-chung-toi" className={cx('nav_link')} onClick={closeMenu}>
              Về Chúng Tôi
            </Link>
          </li>
        </ul>
      </div>

      <div className={cx('header_button')}>
        <Button small>Bắt Đầu</Button>
      </div>

      {/* Overlay để đóng menu khi click bên ngoài */}
      {isOpen && <div className={cx('overlay')} onClick={closeMenu}></div>}
    </div>
  );
}

export default Header;
