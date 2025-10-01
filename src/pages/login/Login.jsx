import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import images from '../../assets/images';
import Button from '../../components/button/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const cx = classNames.bind(styles);
function Login() {
  const [showPass, setShowPass] = useState(false);
  const handleShow = () => {
    setShowPass(!showPass);
  };
  return (
    <div className={cx('wrapper')}>
      <div className={cx('login_title')}>
        <img src={images.logoNew1} alt="Nature Skin AI" className={cx('logo')} />
        <h1>Đăng Nhập</h1>
        <h3>Chào mừng bạn đến với NatureSkin AI</h3>
        <Button to="/">
          {' '}
          <img src={images.google} alt="Google" className={cx('google-icon')} />
        </Button>
      </div>
      {/* <div className={cx('login_form')}>
        <label>Email</label>
        <input type="email" placeholder="Nhập email của bạn" />
        <label>Mật khẩu</label>
        <div className={cx('pass')}>
          {' '}
          <input type={showPass ? 'text' : 'password'} placeholder="Nhập mật khẩu" />
          <span onClick={handleShow}>{showPass ? <FaEyeSlash /> : <FaEye />}</span>
        </div>
      </div>
      <div className={cx('check_option')}>
        <label>
          <input type="checkbox" /> Ghi nhớ mật khẩu
        </label>

        <Button text style={{ color: '#22c55e' }}>
          Quên mật khẩu ?
        </Button>
      </div> */}

      {/* <div className={cx('login_option')}>
        <Button large type="submit">
          Đăng Nhập
        </Button>
        <div className={cx('or')}>Hoặc đăng nhập với</div>
        <Button>
          {' '}
          <img src={images.google} alt="Google" />
          Google
        </Button>
        <div>
          Chưa có tài khoản <Button text>Đăng ký ngay</Button>
        </div>
      </div> */}
    </div>
  );
}

export default Login;
