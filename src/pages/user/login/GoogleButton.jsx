import React, { forwardRef, useImperativeHandle } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import authApi from '../../../apis/authAPi';
import { message } from 'antd';
function GoogleButton(props, ref) {
  useImperativeHandle(ref, () => ({
    triggerLogin() {
      const btn = document.querySelector("div[role='button']");
      if (btn) btn.click();
    },
  }));
  const handleSucess = async (response) => {
    try {
      if (!response?.credential) {
        throw new Error('No credential received from Google');
      }

      const decoded = jwtDecode(response.credential);
      console.log('Decoded Google token:', decoded);
      const googleId = decoded.sub;
      const email = decoded.email;
      const fullName = decoded.name;

      if (!googleId || !email || !fullName) {
        throw new Error('Missing required fields from Google response');
      }

      const loginData = {
        googleId: googleId,
        email: email,
        fullName: fullName,
      };

      console.log('Attempting to login with data:', loginData);

      const res = await authApi.loginWithGoogle(loginData);

      console.log('Backend response:', res);
      console.log('Response data detail:', res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || 'Đăng nhập thất bại');
      }

      const userData = res.data.data;
      console.log('User data detail:', userData);

      if (userData.accessToken) {
        localStorage.setItem('accessToken', userData.accessToken);
      }

      const user = {
        userId: userData.userId,
        fullName: userData.fullName,
        email: userData.email,
        roleId: userData.roleId,
        roleName: userData.roleName,
        avatar: decoded.picture,
      };

      localStorage.setItem('user', JSON.stringify(user));
      message.success('Đăng nhập thành công');

      if (user.roleName?.toLowerCase() === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Google login error:', err);
      message.error(err.message || 'Đăng nhập thất bại!');
    }
  };
  const handleError = () => {
    message.error('Google Logn thất bại');
  };
  return (
    <div style={{ display: 'none' }}>
      <GoogleLogin onSuccess={handleSucess} onError={handleError} useOneTap />
    </div>
  );
}

export default forwardRef(GoogleButton);
