import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Admin.module.scss';
import Button from '../../components/button/Button';
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

  const maxUserValue = Math.max(...monthlyData.map((d) => d.users));
  const maxRevenueValue = Math.max(...monthlyData.map((d) => d.revenue));

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
        return (
          <>
            {/* Stats Cards */}
            <div className={cx('statsGrid')}>
              <div className={cx('statCard')}>
                <div className={cx('statIcon')}>👥</div>
                <div className={cx('statValue')}>{stats.totalUsers.toLocaleString()}</div>
                <div className={cx('statLabel')}>Tổng người dùng</div>
                <div className={cx('statChange', 'positive')}>
                  {stats.userChange} so với tháng trước
                </div>
              </div>

              <div className={cx('statCard')}>
                <div className={cx('statIcon')}>✅</div>
                <div className={cx('statValue')}>{stats.activeUsers.toLocaleString()}</div>
                <div className={cx('statLabel')}>Người dùng hoạt động</div>
                <div className={cx('statChange', 'positive')}>
                  {stats.activeChange} so với tháng trước
                </div>
              </div>

              <div className={cx('statCard')}>
                <div className={cx('statIcon')}>💰</div>
                <div className={cx('statValue')}>{stats.totalRevenue}</div>
                <div className={cx('statLabel')}>Tổng doanh thu</div>
                <div className={cx('statChange', 'positive')}>
                  {stats.revenueChange} so với tháng trước
                </div>
              </div>

              <div className={cx('statCard')}>
                <div className={cx('statIcon')}>🔍</div>
                <div className={cx('statValue')}>{stats.totalScans.toLocaleString()}</div>
                <div className={cx('statLabel')}>Lượt phân tích</div>
                <div className={cx('statChange', 'positive')}>
                  {stats.scanChange} so với tháng trước
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className={cx('chartsSection')}>
              <div className={cx('chartCard')}>
                <h3>📈 Người dùng mới theo tháng</h3>
                <div className={cx('chart')}>
                  {monthlyData.map((data, index) => (
                    <div
                      key={index}
                      className={cx('bar')}
                      style={{ height: `${(data.users / maxUserValue) * 100}%` }}
                    >
                      <span className={cx('barValue')}>{data.users}</span>
                      <span className={cx('barLabel')}>{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cx('chartCard')}>
                <h3>💵 Doanh thu theo tháng (triệu VNĐ)</h3>
                <div className={cx('chart')}>
                  {monthlyData.map((data, index) => (
                    <div
                      key={index}
                      className={cx('bar')}
                      style={{ height: `${(data.revenue / maxRevenueValue) * 100}%` }}
                    >
                      <span className={cx('barValue')}>{data.revenue}</span>
                      <span className={cx('barLabel')}>{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 'users':
        return (
          <div className={cx('tableCard')}>
            <div className={cx('tableHeader')}>
              <h3>👥 Quản lý người dùng</h3>
              <div className={cx('searchBox')}>
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
                <button>Tìm kiếm</button>
              </div>
            </div>

            <div className={cx('tableWrapper')}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên người dùng</th>
                    <th>Email</th>
                    <th>Gói</th>
                    <th>Lượt phân tích</th>
                    <th>Trạng thái</th>
                    <th>Ngày tham gia</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={cx('badge', 'premium')}>{user.package}</span>
                      </td>
                      <td>{user.scans}</td>
                      <td>
                        <span className={cx('badge', user.status)}>
                          {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td>{user.joinDate}</td>
                      <td>
                        <div className={cx('actions')}>
                          <button className={cx('view')}>Xem</button>
                          <button className={cx('edit')}>Sửa</button>
                          <button className={cx('delete')}>Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={cx('pagination')}>
              <button disabled={currentPageUsers === 1}>Trước</button>
              <button className={cx('active')}>1</button>
              <button>2</button>
              <button>3</button>
              <button>Sau</button>
            </div>
          </div>
        );

      case 'packages':
        return (
          <div className={cx('tableCard')}>
            <div className={cx('tableHeader')}>
              <h3>🎫 Quản lý gói dịch vụ</h3>
              <div className={cx('searchBox')}>
                <input
                  type="text"
                  placeholder="Tìm kiếm gói..."
                  value={searchPackage}
                  onChange={(e) => setSearchPackage(e.target.value)}
                />
                <button>Thêm mới</button>
              </div>
            </div>

            <div className={cx('tableWrapper')}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên gói</th>
                    <th>Giá</th>
                    <th>Số lượt chat</th>
                    <th>Tính năng</th>
                    <th>Số người dùng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td>{pkg.id}</td>
                      <td>
                        <strong>{pkg.name}</strong>
                      </td>
                      <td>{pkg.price}</td>
                      <td>{pkg.chats}</td>
                      <td>{pkg.features}</td>
                      <td>{pkg.users}</td>
                      <td>
                        <span className={cx('badge', 'active')}>Hoạt động</span>
                      </td>
                      <td>
                        <div className={cx('actions')}>
                          <button className={cx('view')}>Xem</button>
                          <button className={cx('edit')}>Sửa</button>
                          <button className={cx('delete')}>Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={cx('pagination')}>
              <button disabled={currentPagePackages === 1}>Trước</button>
              <button className={cx('active')}>1</button>
              <button>Sau</button>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className={cx('chartsSection')}>
            <div className={cx('chartCard')}>
              <h3>📈 Người dùng mới theo tháng</h3>
              <div className={cx('chart')}>
                {monthlyData.map((data, index) => (
                  <div
                    key={index}
                    className={cx('bar')}
                    style={{ height: `${(data.users / maxUserValue) * 100}%` }}
                  >
                    <span className={cx('barValue')}>{data.users}</span>
                    <span className={cx('barLabel')}>{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={cx('chartCard')}>
              <h3>💵 Doanh thu theo tháng (triệu VNĐ)</h3>
              <div className={cx('chart')}>
                {monthlyData.map((data, index) => (
                  <div
                    key={index}
                    className={cx('bar')}
                    style={{ height: `${(data.revenue / maxRevenueValue) * 100}%` }}
                  >
                    <span className={cx('barValue')}>{data.revenue}</span>
                    <span className={cx('barLabel')}>{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className={cx('tableCard')}>
            <h3>⚙️ Cài đặt hệ thống</h3>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
              <p>Trang cài đặt đang được phát triển...</p>
            </div>
          </div>
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
