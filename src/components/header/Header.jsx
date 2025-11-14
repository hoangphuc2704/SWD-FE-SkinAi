// import React, { useState } from 'react';
// import classNames from 'classnames/bind';
// import styles from './Header.module.scss';
// import images from '../../assets/images';
// import Button from '../button/Button';
// import { Link as ScrollLink } from 'react-scroll';
// import { Link as RouterLink } from 'react-router-dom';

// const cx = classNames.bind(styles);

// function Header() {
//   const [isOpen, setIsOpen] = useState(false);

//   const openMenu = () => setIsOpen(!isOpen);
//   const closeMenu = () => setIsOpen(false);

//   return (
//     <div className={cx('header')}>
//       <div className={cx('header_logo')}>
//         <img src={images.logoNew} alt="Nature Skin AI" />
//         <span>Nature Skin AI</span>
//       </div>

//       <button className={cx('toggle_button')} onClick={openMenu}>
//         <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-grip-lines'}`}></i>
//       </button>

//       <div className={cx('header_nav', { active: isOpen })}>
//         <ul className={cx('nav_menu')}>
//           <li className={cx('nav_item')}>
//             <ScrollLink
//               to="home"
//               smooth={true}
//               duration={500}
//               className={cx('nav_link')}
//               onClick={closeMenu}
//             >
//               Trang Chủ
//             </ScrollLink>
//           </li>
//           <li className={cx('nav_item')}>
//             <ScrollLink
//               to="aipage"
//               smooth={true}
//               duration={500}
//               className={cx('nav_link')}
//               onClick={closeMenu}
//             >
//               Tư Vấn AI
//             </ScrollLink>
//           </li>
//           <li className={cx('nav_item')}>
//             <ScrollLink
//               to="routine"
//               smooth={true}
//               duration={500}
//               className={cx('nav_link')}
//               onClick={closeMenu}
//             >
//               Quy Trình
//             </ScrollLink>
//           </li>
//           <li className={cx('nav_item')}>
//             <ScrollLink
//               to="aboutus"
//               smooth={true}
//               duration={500}
//               className={cx('nav_link')}
//               onClick={closeMenu}
//             >
//               Về Chúng Tôi
//             </ScrollLink>
//           </li>
//           <li className={cx('nav_item')}>
//             <ScrollLink
//               to="buyproducts"
//               smooth={true}
//               duration={500}
//               className={cx('nav_link')}
//               onClick={closeMenu}
//             >
//               Gói Mua Hàng
//             </ScrollLink>
//           </li>
//           {/* <li className={cx('nav_item')}>
//             <RouterLink to="/chatai" className={cx('nav_link')} onClick={closeMenu}>
//               Chat AI
//             </RouterLink>
//           </li> */}
//         </ul>
//       </div>

//       <div className={cx('header_button')}>
//         <Button to="/login" small>
//           Login
//         </Button>
//         <Button to="/admin" small>
//           Admin
//         </Button>
//       </div>

//       {/* Overlay để đóng menu khi click bên ngoài */}
//       {isOpen && <div className={cx('overlay')} onClick={closeMenu}></div>}
//     </div>
//   );
// }

// export default Header;
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '../../assets/images';
import Button from '../button/Button';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const openMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <div className={cx('header')}>
      <div className={cx('header_logo')}>
        <img src={images.logoNew} alt="Nature Skin AI" />
        <span>Nature Skin AI</span>
      </div>

      <button className={cx('toggle_button')} onClick={openMenu}>
        <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-grip-lines'}`}></i>
      </button>

      <div className={cx('header_nav', { active: isOpen })}>
        <ul className={cx('nav_menu')}>
          <li className={cx('nav_item')}>
            {location.pathname === '/' ? (
              <ScrollLink
                to="home"
                smooth={true}
                duration={500}
                className={cx('nav_link')}
                onClick={closeMenu}
              >
                Trang Chủ
              </ScrollLink>
            ) : (
              <RouterLink
                to="/"
                state={{ scrollTo: 'home' }}
                className={cx('nav_link')}
                onClick={closeMenu}
              >
                Trang Chủ
              </RouterLink>
            )}
          </li>
          <li className={cx('nav_item')}>
            {location.pathname === '/' ? (
              <ScrollLink
                to="aipage"
                smooth={true}
                duration={500}
                className={cx('nav_link')}
                onClick={closeMenu}
              >
                Tư Vấn AI
              </ScrollLink>
            ) : (
              <RouterLink
                to="/"
                state={{ scrollTo: 'aipage' }}
                className={cx('nav_link')}
                onClick={closeMenu}
              >
                Tư Vấn AI
              </RouterLink>
            )}
          </li>
          <li className={cx('nav_item')}>
            {location.pathname === '/' ? (
              <ScrollLink
                to="routine"
                smooth={true}
                duration={500}
                className={cx('nav_link')}
                onClick={closeMenu}
              >
                Quy Trình
              </ScrollLink>
            ) : (
              <RouterLink
                to="/"
                state={{
                  scrollTo: 'routine',
                  userId: (user && (user.id || user.userId)) || undefined,
                }}
                className={cx('nav_link')}
                onClick={closeMenu}
              >
                Quy Trình
              </RouterLink>
            )}
          </li>
          <li className={cx('nav_item')}>
            {location.pathname === '/' ? (
              <ScrollLink
                to="aboutus"
                smooth={true}
                duration={500}
                className={cx('nav_link')}
                onClick={closeMenu}
              >
                Về Chúng Tôi
              </ScrollLink>
            ) : (
              <RouterLink
                to="/"
                state={{ scrollTo: 'aboutus' }}
                className={cx('nav_link')}
                onClick={closeMenu}
              >
                Về Chúng Tôi
              </RouterLink>
            )}
          </li>
          {/* <li className={cx('nav_item')}>
            {location.pathname === '/' ? (
              <ScrollLink
                to="buyproducts"
                smooth={true}
                duration={500}
                className={cx('nav_link')}
                onClick={closeMenu}
              >
                Gói Mua Hàng
              </ScrollLink>
            ) : (
              <RouterLink
                to="/"
                state={{ scrollTo: 'buyproducts' }}
                className={cx('nav_link')}
                onClick={closeMenu}
              >
                Gói Mua Hàng
              </RouterLink>
            )}
          </li> */}
        </ul>
      </div>

      <div className={cx('header_button')}>
        {user ? (
          <div className={cx('user_info')}>
            <span className={cx('user_name')}>{user.fullName}</span>
            <RouterLink to="/profile" className={cx('profile_link')}>
              <img
                src={user.avatar || images.profileIcon}
                alt="Profile"
                className={cx('profile_icon')}
              />
            </RouterLink>
            <button onClick={handleLogout} className={cx('logout_btn')}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <>
            <Button to="/login" small>
              Login
            </Button>
            {/* <Button to="/admin" small>
              Admin
            </Button> */}
          </>
        )}
      </div>

      {isOpen && <div className={cx('overlay')} onClick={closeMenu}></div>}
    </div>
  );
}

export default Header;
