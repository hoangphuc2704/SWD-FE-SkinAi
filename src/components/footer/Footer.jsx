// Footer.jsx
import React from 'react';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import images from '../../assets/images';
import { Link } from 'react-router-dom';
import Button from '../button/Button';

const cx = classNames.bind(styles);

function Footer() {
  return (
    <footer className={cx('footer')}>
      <div className={cx('container')}>
        <div className={cx('content')}>
          {/* Logo và mô tả */}
          <div className={cx('section', 'about')}>
            <div className={cx('logo')}>
              <img src={images.logo} alt="Logo" />
            </div>
            <p className={cx('description')}>
              Chúng tôi cung cấp những sản phẩm và dịch vụ tốt nhất với chất lượng cao và giá cả hợp
              lý.
            </p>
            <div className={cx('social-links')}>
              <a href="#" className={cx('social-link')}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className={cx('social-link')}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={cx('social-link')}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className={cx('social-link')}>
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div className={cx('section', 'links')}>
            <h3 className={cx('title')}>Liên kết nhanh</h3>
            <ul className={cx('link-list')}>
              <li>
                <Link to="/" className={cx('link')}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/about" className={cx('link')}>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/products" className={cx('link')}>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/services" className={cx('link')}>
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/contact" className={cx('link')}>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Dịch vụ */}
          <div className={cx('section', 'services')}>
            <h3 className={cx('title')}>Dịch vụ</h3>
            <ul className={cx('link-list')}>
              <li>
                <Link to="/support" className={cx('link')}>
                  Hỗ trợ khách hàng
                </Link>
              </li>
              <li>
                <Link to="/warranty" className={cx('link')}>
                  Bảo hành
                </Link>
              </li>
              <li>
                <Link to="/shipping" className={cx('link')}>
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/returns" className={cx('link')}>
                  Đổi trả
                </Link>
              </li>
              <li>
                <Link to="/faq" className={cx('link')}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div className={cx('section', 'contact')}>
            <h3 className={cx('title')}>Liên hệ</h3>
            <div className={cx('contact-info')}>
              <div className={cx('contact-item')}>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className={cx('contact-item')}>
                <i className="fas fa-phone"></i>
                <span>+84 123 456 789</span>
              </div>
              <div className={cx('contact-item')}>
                <i className="fas fa-envelope"></i>
                <span>contact@example.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className={cx('newsletter')}>
              <h4 className={cx('newsletter-title')}>Đăng ký nhận tin</h4>
              <div className={cx('newsletter-form')}>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className={cx('newsletter-input')}
                />
                <Button className={cx('newsletter-btn')} primary>
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={cx('bottom')}>
          <div className={cx('copyright')}>
            <p>&copy; 2024 Your Company. Tất cả quyền được bảo lưu.</p>
          </div>
          <div className={cx('legal-links')}>
            <Link to="/privacy" className={cx('legal-link')}>
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className={cx('legal-link')}>
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
