import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './BuyProducts.module.scss';
import { useNavigate } from 'react-router-dom';
import { Circle, CircleCheck } from 'lucide-react';

const cx = classNames.bind(styles);

function BuyProducts() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Replace with your auth logic
  const [open, setOpen] = useState(false);
  const [packageSetting, setPackageSetting] = useState([]);
  const selectedPackage = useRef(undefined);

  // Mock translations - replace with your i18n solution
  const t = (key) => {
    const translations = {
      title: 'Choose Your Package',
      description: 'Select the best plan for your needs',
      basic_title: 'Basic',
      basic_description: 'Perfect for getting started',
      pro_title: 'Pro',
      pro_description: 'Most popular for businesses',
      vip_title: 'VIP',
      vip_description: 'Ultimate features and support',
      basic_privilege_1: 'Feature 1',
      basic_privilege_2: 'Feature 2',
      basic_privilege_3: 'Feature 3',
      basic_privilege_4: 'Feature 4',
      basic_privilege_5: 'Feature 5',
      basic_privilege_6: 'Feature 6',
      basic_privilege_7: 'Feature 7',
      pro_privilege_1: 'Feature 1',
      pro_privilege_2: 'Feature 2',
      pro_privilege_3: 'Feature 3',
      pro_privilege_4: 'Feature 4',
      pro_privilege_5: 'Feature 5',
      pro_privilege_6: 'Feature 6',
      pro_privilege_7: 'Feature 7',
      vip_privilege_1: 'Feature 1',
      vip_privilege_2: 'Feature 2',
      vip_privilege_3: 'Feature 3',
      vip_privilege_4: 'Feature 4',
      vip_privilege_5: 'Feature 5',
      vip_privilege_6: 'Feature 6',
      vip_privilege_7: 'Feature 7',
      bestSeller: 'Best Seller',
      month: '/month',
      owned: 'Owned',
      buyNow: 'Buy Now',
    };
    return translations[key] || key;
  };

  const fetchSetting = async () => {
    try {
      // Replace with your API call
      // const res = await getPackageSetting();
      // setPackageSetting(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchSetting();
  }, []);

  const handleBuyPackage = useCallback(
    (item) => {
      if (!user) {
        navigate('/login');
        return;
      }
      setOpen(true);
      const choosePackage = packageSetting.find((pkg) => pkg.boothId === item.id);
      selectedPackage.current = { choosePackage, item };
    },
    [user, packageSetting, navigate]
  );

  const handleClose = () => {
    setOpen(false);
    selectedPackage.current = undefined;
  };

  const dataPacket = [
    {
      id: 1,
      title: t('basic_title'),
      description: t('basic_description'),
      price: 100,
      privilege: [
        { title: t('basic_privilege_1'), show: true },
        { title: t('basic_privilege_2'), show: true },
        { title: t('basic_privilege_3'), show: true },
        { title: t('basic_privilege_4'), show: true },
        { title: t('basic_privilege_5'), show: true },
        { title: t('basic_privilege_6'), show: false },
        { title: t('basic_privilege_7'), show: false },
      ],
      bestSeller: false,
    },
    {
      id: 2,
      title: t('pro_title'),
      description: t('pro_description'),
      price: 1000,
      privilege: [
        { title: t('pro_privilege_1'), show: true },
        { title: t('pro_privilege_2'), show: true },
        { title: t('pro_privilege_3'), show: true },
        { title: t('pro_privilege_4'), show: true },
        { title: t('pro_privilege_5'), show: true },
        { title: t('pro_privilege_6'), show: true },
        { title: t('pro_privilege_7'), show: false },
      ],
      bestSeller: true,
    },
    {
      id: 3,
      title: t('vip_title'),
      description: t('vip_description'),
      price: 10000,
      privilege: [
        { title: t('vip_privilege_1'), show: true },
        { title: t('vip_privilege_2'), show: true },
        { title: t('vip_privilege_3'), show: true },
        { title: t('vip_privilege_4'), show: true },
        { title: t('vip_privilege_5'), show: true },
        { title: t('vip_privilege_6'), show: true },
        { title: t('vip_privilege_7'), show: true },
      ],
      bestSeller: false,
    },
  ];

  const getPackageStyles = (title) => {
    if (title === t('basic_title')) {
      return 'basic';
    } else if (title === t('pro_title')) {
      return 'pro';
    } else if (title === t('vip_title')) {
      return 'vip';
    }
    return 'basic';
  };

  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        <h1 className={cx('title')}>{t('title')}</h1>
        <p className={cx('description')}>{t('description')}</p>
      </div>
      <div className={cx('packages')}>
        {dataPacket.map((item) => {
          const isOwned = user?.seller?.some((booth) => booth.boothId === item.id);
          const packageType = getPackageStyles(item.title);

          return (
            <div key={item.id} className={cx('package-card', packageType)}>
              <div className={cx('package-header')}>
                <div className={cx('package-title-wrapper')}>
                  <p className={cx('package-title')}>{item.title}</p>
                  {item.bestSeller && (
                    <span className={cx('best-seller-badge')}>{t('bestSeller')}</span>
                  )}
                </div>
                <div className={cx('package-price')}>
                  ${item.price.toLocaleString('en-US')}
                  <span className={cx('price-period')}>{t('month')}</span>
                </div>
              </div>
              <p className={cx('package-description')}>{item.description}</p>
              <button
                disabled={isOwned}
                className={cx('buy-button', { owned: isOwned })}
                onClick={() => handleBuyPackage(item)}
              >
                {isOwned ? t('owned') : t('buyNow')}
              </button>
              <hr className={cx('divider')} />
              <ul className={cx('privilege-list')}>
                {item.privilege.map((privilege) => (
                  <li
                    className={cx('privilege-item', { disabled: !privilege.show })}
                    key={privilege.title}
                  >
                    {!privilege.show ? (
                      <Circle className={cx('icon')} />
                    ) : (
                      <CircleCheck className={cx('icon', 'icon-checked')} />
                    )}
                    <span className={cx('privilege-text')}>{privilege.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {open && selectedPackage.current && (
        <div className={cx('modal')}>
          {/* Add your PackageModal component here */}
          <div className={cx('modal-content')}>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyProducts;
