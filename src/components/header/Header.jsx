import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '../../assets/images';
import Button from '../button/Button';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

const cx = classNames.bind(styles);

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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
            <ScrollLink
              to="home"
              smooth={true}
              duration={500}
              className={cx('nav_link')}
              onClick={closeMenu}
            >
              Trang Chủ
            </ScrollLink>
          </li>
          <li className={cx('nav_item')}>
            <ScrollLink
              to="aipage"
              smooth={true}
              duration={500}
              className={cx('nav_link')}
              onClick={closeMenu}
            >
              Tư Vấn AI
            </ScrollLink>
          </li>
          <li className={cx('nav_item')}>
            <ScrollLink
              to="routine"
              smooth={true}
              duration={500}
              className={cx('nav_link')}
              onClick={closeMenu}
            >
              Quy Trình
            </ScrollLink>
          </li>
          <li className={cx('nav_item')}>
            <ScrollLink
              to="aboutus"
              smooth={true}
              duration={500}
              className={cx('nav_link')}
              onClick={closeMenu}
            >
              Về Chúng Tôi
            </ScrollLink>
          </li>
          <li className={cx('nav_item')}>
            <ScrollLink
              to="buyproducts"
              smooth={true}
              duration={500}
              className={cx('nav_link')}
              onClick={closeMenu}
            >
              Gói Mua Hàng
            </ScrollLink>
          </li>
          {/* <li className={cx('nav_item')}>
            <RouterLink to="/chatai" className={cx('nav_link')} onClick={closeMenu}>
              Chat AI
            </RouterLink>
          </li> */}
        </ul>
      </div>

      <div className={cx('header_button')}>
        <Button to="/login" small>
          Login
        </Button>
        <Button to="/admin" small>
          Admin
        </Button>
      </div>

      {/* Overlay để đóng menu khi click bên ngoài */}
      {isOpen && <div className={cx('overlay')} onClick={closeMenu}></div>}
    </div>
  );
}

export default Header;
