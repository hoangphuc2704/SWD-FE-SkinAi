// import React from 'react';
// import classNames from 'classnames/bind';
// import styles from '../Admin.module.scss';
// const cx = classNames.bind(styles);
// function Dashboard({ stats, monthlyData }) {
//   const maxUserValue = Math.max(...monthlyData.map((d) => d.users));
//   const maxRevenueValue = Math.max(...monthlyData.map((d) => d.revenue));
//   return (
//     <>
//       {/* Stats Cards */}
//       <div className={cx('statsGrid')}>
//         <div className={cx('statCard')}>
//           <div className={cx('statIcon')}>👥</div>
//           <div className={cx('statValue')}>{stats.totalUsers.toLocaleString()}</div>
//           <div className={cx('statLabel')}>Tổng người dùng</div>
//           <div className={cx('statChange', 'positive')}>{stats.userChange} so với tháng trước</div>
//         </div>

//         <div className={cx('statCard')}>
//           <div className={cx('statIcon')}>✅</div>
//           <div className={cx('statValue')}>{stats.activeUsers.toLocaleString()}</div>
//           <div className={cx('statLabel')}>Người dùng hoạt động</div>
//           <div className={cx('statChange', 'positive')}>
//             {stats.activeChange} so với tháng trước
//           </div>
//         </div>

//         <div className={cx('statCard')}>
//           <div className={cx('statIcon')}>💰</div>
//           <div className={cx('statValue')}>{stats.totalRevenue}</div>
//           <div className={cx('statLabel')}>Tổng doanh thu</div>
//           <div className={cx('statChange', 'positive')}>
//             {stats.revenueChange} so với tháng trước
//           </div>
//         </div>

//         <div className={cx('statCard')}>
//           <div className={cx('statIcon')}>🔍</div>
//           <div className={cx('statValue')}>{stats.totalScans.toLocaleString()}</div>
//           <div className={cx('statLabel')}>Lượt phân tích</div>
//           <div className={cx('statChange', 'positive')}>{stats.scanChange} so với tháng trước</div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className={cx('chartsSection')}>
//         <div className={cx('chartCard')}>
//           <h3>📈 Người dùng mới theo tháng</h3>
//           <div className={cx('chart')}>
//             {monthlyData.map((data, index) => (
//               <div
//                 key={index}
//                 className={cx('bar')}
//                 style={{ height: `${(data.users / maxUserValue) * 100}%` }}
//               >
//                 <span className={cx('barValue')}>{data.users}</span>
//                 <span className={cx('barLabel')}>{data.month}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={cx('chartCard')}>
//           <h3>💵 Doanh thu theo tháng (triệu VNĐ)</h3>
//           <div className={cx('chart')}>
//             {monthlyData.map((data, index) => (
//               <div
//                 key={index}
//                 className={cx('bar')}
//                 style={{ height: `${(data.revenue / maxRevenueValue) * 100}%` }}
//               >
//                 <span className={cx('barValue')}>{data.revenue}</span>
//                 <span className={cx('barLabel')}>{data.month}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Admin.module.scss';
import { getUsers } from '../../../apis/userApi';
const cx = classNames.bind(styles);

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    userChange: '+0%',
    activeChange: '+0%',
    revenueChange: '+0%',
    totalScans: 0,
    scanChange: '+0%',
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers(1, 9999); // lấy tất cả user (hoặc giới hạn lớn)
        const data = res.data?.items || res.data || [];
        setUsers(data);

        // 🧮 Tính thống kê cơ bản
        const totalUsers = data.length;
        const activeUsers = data.filter((u) => u.status === 'active').length;

        // 🧾 Nếu có revenue, tính tổng (giả sử mỗi user có field revenue)
        const totalRevenue = data.reduce((sum, u) => sum + (u.revenue || 0), 0);

        // 📊 Group người dùng theo tháng (dựa vào createdAt)
        const monthStats = {};
        data.forEach((u) => {
          if (u.createdAt) {
            const month = new Date(u.createdAt).toLocaleString('vi-VN', {
              month: 'short',
            });
            monthStats[month] = (monthStats[month] || 0) + 1;
          }
        });

        const monthlyDataArray = Object.entries(monthStats).map(([month, count]) => ({
          month,
          users: count,
          revenue: Math.floor(Math.random() * 20) + 5, // tạm doanh thu mẫu
        }));

        setStats((prev) => ({
          ...prev,
          totalUsers,
          activeUsers,
          totalRevenue,
        }));
        setMonthlyData(monthlyDataArray);
      } catch (err) {
        console.error('❌ Lỗi khi lấy dữ liệu người dùng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>⏳ Đang tải dữ liệu...</div>;

  const maxUserValue = Math.max(...monthlyData.map((d) => d.users), 1);
  const maxRevenueValue = Math.max(...monthlyData.map((d) => d.revenue), 1);

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
