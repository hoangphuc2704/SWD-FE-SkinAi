import React from 'react';
import classNames from 'classnames/bind';
import styles from '../Admin.module.scss';
const cx = classNames.bind(styles);
function Dashboard({ stats, monthlyData }) {
  const maxUserValue = Math.max(...monthlyData.map((d) => d.users));
  const maxRevenueValue = Math.max(...monthlyData.map((d) => d.revenue));
  return (
    <>
      {/* Stats Cards */}
      <div className={cx('statsGrid')}>
        <div className={cx('statCard')}>
          <div className={cx('statIcon')}>👥</div>
          <div className={cx('statValue')}>{stats.totalUsers.toLocaleString()}</div>
          <div className={cx('statLabel')}>Tổng người dùng</div>
          <div className={cx('statChange', 'positive')}>{stats.userChange} so với tháng trước</div>
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
          <div className={cx('statChange', 'positive')}>{stats.scanChange} so với tháng trước</div>
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
}

export default Dashboard;
