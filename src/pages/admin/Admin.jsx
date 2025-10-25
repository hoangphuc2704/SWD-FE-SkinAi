import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Admin.module.scss';
import Button from '../../components/button/Button';
import Dashboard from './dashboard/Dashboard';
import ManagePackages from './managePackages/ManagePackages';
import ManageUsers from './manageUsers/ManageUsers';
const cx = classNames.bind(styles);

function Admin() {
  const [searchUser, setSearchUser] = useState('');
  const [searchPackage, setSearchPackage] = useState('');
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPagePackages, setCurrentPagePackages] = useState(1);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data - thay thế bằng API calls thực tế
  const stats = {
    totalUsers: 1234,
    userChange: '+12.5%',
    activeUsers: 892,
    activeChange: '+8.2%',
    totalRevenue: '45.2M VNĐ',
    revenueChange: '+15.3%',
    totalScans: 5678,
    scanChange: '+22.1%',
  };

  const monthlyData = [
    { month: 'T1', users: 120, revenue: 3.2 },
    { month: 'T2', users: 145, revenue: 4.1 },
    { month: 'T3', users: 180, revenue: 5.5 },
    { month: 'T4', users: 210, revenue: 6.8 },
    { month: 'T5', users: 250, revenue: 8.2 },
    { month: 'T6', users: 329, revenue: 11.4 },
  ];

  const users = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      package: 'Premium',
      scans: 45,
      status: 'active',
      joinDate: '15/01/2024',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      package: 'Basic',
      scans: 12,
      status: 'active',
      joinDate: '22/01/2024',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      package: 'Pro',
      scans: 28,
      status: 'inactive',
      joinDate: '03/02/2024',
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      email: 'phamthid@email.com',
      package: 'Premium',
      scans: 67,
      status: 'active',
      joinDate: '10/02/2024',
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      email: 'hoangvane@email.com',
      package: 'Basic',
      scans: 8,
      status: 'active',
      joinDate: '18/02/2024',
    },
  ];

  const packages = [
    {
      id: 1,
      name: 'Basic',
      price: '0 VNĐ',
      chats: 5,
      features: 'Phân tích cơ bản, 5 lượt chat',
      users: 450,
      status: 'active',
    },
    {
      id: 2,
      name: 'Pro',
      price: '199.000 VNĐ',
      chats: 50,
      features: 'Phân tích chuyên sâu, 50 lượt chat, Tư vấn AI',
      users: 280,
      status: 'active',
    },
    {
      id: 3,
      name: 'Premium',
      price: '499.000 VNĐ',
      chats: 'Unlimited',
      features: 'Tất cả tính năng, Chat không giới hạn, Ưu tiên hỗ trợ',
      users: 120,
      status: 'active',
    },
    {
      id: 4,
      name: 'Enterprise',
      price: 'Liên hệ',
      chats: 'Unlimited',
      features: 'Giải pháp doanh nghiệp, API access',
      users: 15,
      status: 'active',
    },
  ];

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Người dùng' },
    { id: 'packages', icon: '🎫', label: 'Gói dịch vụ' },
    { id: 'analytics', icon: '📈', label: 'Thống kê' },
    { id: 'settings', icon: '⚙️', label: 'Cài đặt' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard stats={stats} monthlyData={monthlyData} />;
      case 'users':
        return (
          <ManageUsers
            users={users}
            searchUser={searchUser}
            setSearchUser={setSearchUser}
            currentPageUsers={currentPageUsers}
            setCurrentPageUsers={setCurrentPageUsers}
          />
        );
      case 'packages':
        return (
          <ManagePackages
            packages={packages}
            searchPackage={searchPackage}
            setSearchPackage={setSearchPackage}
            currentPagePackages={currentPagePackages}
            setCurrentPagePackages={setCurrentPagePackages}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cx('adminWrapper')}>
      {/* Sidebar */}
      <div className={cx('sidebar', { collapsed: sidebarCollapsed })}>
        <div className={cx('sidebarHeader')}>
          <div className={cx('logo')}>
            <span className={cx('logoIcon')}>🎯</span>
            {!sidebarCollapsed && <span className={cx('logoText')}>Admin Panel</span>}
          </div>
          <button
            className={cx('toggleBtn')}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className={cx('sidebarNav')}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={cx('navItem', { active: activeView === item.id })}
              onClick={() => setActiveView(item.id)}
            >
              <span className={cx('navIcon')}>{item.icon}</span>
              {!sidebarCollapsed && <span className={cx('navLabel')}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className={cx('sidebarFooter')}>
          <Button className={cx('navItem')} to="/">
            <span className={cx('navIcon')}>🚪</span>
            {!sidebarCollapsed && <span className={cx('navLabel')}>Đăng xuất</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={cx('mainContent')}>
        <div className={cx('header')}>
          <h1>📊 Admin Dashboard</h1>
          <p>Quản lý người dùng, gói dịch vụ và thống kê hệ thống</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default Admin;
