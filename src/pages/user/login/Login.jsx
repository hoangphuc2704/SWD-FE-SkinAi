import React, { useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import images from '../../../assets/images';
import Button from '../../../components/button/Button';
import GoogleButton from './GoogleButton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const cx = classNames.bind(styles);
function Login() {
  const googleBtnRef = useRef();

  const handleGoogleCLick = () => {
    if (googleBtnRef.current) {
      googleBtnRef.current.triggerLogin();
    }
    console.log(window.location.origin);
  };
  return (
    <div className={cx('wrapper')}>
      <div className={cx('login_title')}>
        <img src={images.logoNew1} alt="Nature Skin AI" className={cx('logo')} />
        <h1>Đăng Nhập</h1>
        <h3>Chào mừng bạn đến với NatureSkin AI</h3>

        <Button onClick={handleGoogleCLick}>
          <img src={images.google} alt="Google" className={cx('google-icon')} />
        </Button>
        <GoogleButton ref={googleBtnRef} />
      </div>
    </div>
  );
}

export default Login;
