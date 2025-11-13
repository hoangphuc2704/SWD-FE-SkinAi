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
import { getAllRoutines } from '../../../apis/routineApi';
import { getAllFeedbacks } from '../../../apis/feedbackApi';
import { getChatSessions } from '../../../apis/chatApi';
const cx = classNames.bind(styles);

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRoutines: 0,
    totalFeedbacks: 0,
    totalConsultations: 0,
    userChange: '+0%',
    activeChange: '+0%',
    routineChange: '+0%',
    consultationChange: '+0%',
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 📊 Parallel fetch tất cả dữ liệu
        const [usersRes, routinesRes, feedbacksRes, chatSessionsRes] = await Promise.allSettled([
          getUsers(1, 9999),
          getAllRoutines(),
          getAllFeedbacks().catch(() => ({ data: [] })), // graceful fallback
          getChatSessions({ pageNumber: 1, pageSize: 9999 }).catch(() => ({ data: [] })),
        ]);

        // 👥 Users
        const users =
          usersRes.status === 'fulfilled'
            ? usersRes.value?.data?.items || usersRes.value?.data || []
            : [];
        const totalUsers = users.length;
        const activeUsers = users.filter((u) => (u.status || '').toLowerCase() === 'active').length;

        // 📋 Routines
        const routines =
          routinesRes.status === 'fulfilled'
            ? routinesRes.value?.data?.items || routinesRes.value?.data || routinesRes.value || []
            : [];
        const totalRoutines = Array.isArray(routines)
          ? routines.filter((r) => (r.status || '').toLowerCase() !== 'archived').length
          : 0;

        // 💬 Feedbacks
        const feedbacks =
          feedbacksRes.status === 'fulfilled'
            ? feedbacksRes.value?.data?.items || feedbacksRes.value?.data || []
            : [];
        const totalFeedbacks = Array.isArray(feedbacks) ? feedbacks.length : 0;

        // 💭 Chat Sessions (Consultations)
        const chatSessions =
          chatSessionsRes.status === 'fulfilled'
            ? chatSessionsRes.value?.data?.items || chatSessionsRes.value?.data || []
            : [];
        const totalConsultations = Array.isArray(chatSessions) ? chatSessions.length : 0;

        // 📊 Group users theo tháng (từ createdAt)
        const monthStats = {};
        const now = new Date();
        const last6Months = [];

        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = d.toLocaleString('vi-VN', { month: 'short', year: 'numeric' });
          last6Months.push(monthKey);
          monthStats[monthKey] = { users: 0, routines: 0, consultations: 0 };
        }

        users.forEach((u) => {
          if (u.createdAt) {
            const month = new Date(u.createdAt).toLocaleString('vi-VN', {
              month: 'short',
              year: 'numeric',
            });
            if (monthStats[month]) {
              monthStats[month].users += 1;
            }
          }
        });

        routines.forEach((r) => {
          if (r.createdAt) {
            const month = new Date(r.createdAt).toLocaleString('vi-VN', {
              month: 'short',
              year: 'numeric',
            });
            if (monthStats[month]) {
              monthStats[month].routines += 1;
            }
          }
        });

        chatSessions.forEach((c) => {
          if (c.createdAt) {
            const month = new Date(c.createdAt).toLocaleString('vi-VN', {
              month: 'short',
              year: 'numeric',
            });
            if (monthStats[month]) {
              monthStats[month].consultations += 1;
            }
          }
        });

        const monthlyDataArray = last6Months.map((month) => ({
          month: month.split(' ')[0], // chỉ lấy tên tháng
          users: monthStats[month]?.users || 0,
          routines: monthStats[month]?.routines || 0,
          consultations: monthStats[month]?.consultations || 0,
        }));

        // 📈 Tính % thay đổi so với tháng trước (simplified)
        const currentMonthUsers = monthlyDataArray[5]?.users || 0;
        const lastMonthUsers = monthlyDataArray[4]?.users || 1;
        const userChange = (((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(
          0
        );

        const activeChange = '+12%'; // mock - cần historical data

        const currentMonthRoutines = monthlyDataArray[5]?.routines || 0;
        const lastMonthRoutines = monthlyDataArray[4]?.routines || 1;
        const routineChange = (
          ((currentMonthRoutines - lastMonthRoutines) / lastMonthRoutines) *
          100
        ).toFixed(0);

        const currentMonthConsultations = monthlyDataArray[5]?.consultations || 0;
        const lastMonthConsultations = monthlyDataArray[4]?.consultations || 1;
        const consultationChange = (
          ((currentMonthConsultations - lastMonthConsultations) / lastMonthConsultations) *
          100
        ).toFixed(0);

        setStats({
          totalUsers,
          activeUsers,
          totalRoutines,
          totalFeedbacks,
          totalConsultations,
          userChange: `${userChange >= 0 ? '+' : ''}${userChange}%`,
          activeChange,
          routineChange: `${routineChange >= 0 ? '+' : ''}${routineChange}%`,
          consultationChange: `${consultationChange >= 0 ? '+' : ''}${consultationChange}%`,
        });
        setMonthlyData(monthlyDataArray);
      } catch (err) {
        console.error('❌ Lỗi khi lấy dữ liệu dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>⏳ Đang tải dữ liệu...</div>;

  const maxUserValue = Math.max(...monthlyData.map((d) => d.users), 1);
  const maxRoutineValue = Math.max(...monthlyData.map((d) => d.routines), 1);
  const maxConsultationValue = Math.max(...monthlyData.map((d) => d.consultations), 1);

  return (
    <>
      {/* Stats Cards */}
      <div className={cx('statsGrid')}>
        <div className={cx('statCard')}>
          <div className={cx('statValue')}>{stats.totalUsers.toLocaleString()}</div>
          <div className={cx('statLabel')}>Tổng người dùng</div>
          <div className={cx('statChange', 'positive')}>{stats.userChange} so với tháng trước</div>
        </div>

        <div className={cx('statCard')}>
          <div className={cx('statValue')}>{stats.activeUsers.toLocaleString()}</div>
          <div className={cx('statLabel')}>Người dùng hoạt động</div>
          <div className={cx('statChange', 'positive')}>
            {stats.activeChange} so với tháng trước
          </div>
        </div>

        <div className={cx('statCard')}>
          <div className={cx('statValue')}>{stats.totalRoutines.toLocaleString()}</div>
          <div className={cx('statLabel')}>Lộ trình chăm sóc</div>
          <div className={cx('statChange', 'positive')}>
            {stats.routineChange} so với tháng trước
          </div>
        </div>

        <div className={cx('statCard')}>
          <div className={cx('statValue')}>{stats.totalConsultations.toLocaleString()}</div>
          <div className={cx('statLabel')}>Lượt tư vấn</div>
          <div className={cx('statChange', 'positive')}>
            {stats.consultationChange} so với tháng trước
          </div>
        </div>

        <div className={cx('statCard')}>
          <div className={cx('statValue')}>{stats.totalFeedbacks.toLocaleString()}</div>
          <div className={cx('statLabel')}>Đánh giá</div>
          <div className={cx('statChange', 'positive')}>+0% so với tháng trước</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={cx('chartsSection')}>
        <div className={cx('chartCard')}>
          <h3>Người dùng mới theo tháng</h3>
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
          <h3>Lộ trình được tạo theo tháng</h3>
          <div className={cx('chart')}>
            {monthlyData.map((data, index) => (
              <div
                key={index}
                className={cx('bar')}
                style={{ height: `${(data.routines / maxRoutineValue) * 100}%` }}
              >
                <span className={cx('barValue')}>{data.routines}</span>
                <span className={cx('barLabel')}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cx('chartCard')}>
          <h3>Tư vấn AI theo tháng</h3>
          <div className={cx('chart')}>
            {monthlyData.map((data, index) => (
              <div
                key={index}
                className={cx('bar')}
                style={{ height: `${(data.consultations / maxConsultationValue) * 100}%` }}
              >
                <span className={cx('barValue')}>{data.consultations}</span>
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
