import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { usersAPI, ordersAPI, cohortsAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  Phone,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    usersWithPhones: 0,
    phonePercentage: 0,
  });
  const [cohortData, setCohortData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [phoneData, setPhoneData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch basic stats
      const [usersResponse, ordersResponse] = await Promise.all([
        usersAPI.getStats().catch(() => ({ data: { totalUsers: 0 } })),
        ordersAPI
          .getStats()
          .catch(() => ({
            data: { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
          })),
      ]);

      console.log('Dashboard API responses:', {
        usersResponse,
        ordersResponse,
      });

      // Fetch phone numbers data
      let phoneStats = { phones: [], totalCount: 0 };
      try {
        const phoneResponse = await usersAPI.getPhoneNumbers();
        phoneStats = phoneResponse.data || { phones: [], totalCount: 0 };
      } catch (error) {
        console.log('Phone data not available');
      }

      const totalUsers = usersResponse.data?.totalUsers || 0;
      const usersWithPhones = phoneStats.totalCount || 0;

      setStats({
        totalUsers,
        totalOrders: ordersResponse.data?.totalOrders || 0,
        totalRevenue: ordersResponse.data?.totalRevenue || 0,
        averageOrderValue: ordersResponse.data?.averageOrderValue || 0,
        usersWithPhones,
        phonePercentage:
          totalUsers > 0 ? Math.round((usersWithPhones / totalUsers) * 100) : 0,
      });

      // Set phone data for charts
      const phonesArray = phoneStats.phones || [];
      setPhoneData(Array.isArray(phonesArray) ? phonesArray : []);

      // Fetch cohort analysis
      try {
        const cohortResponse = await cohortsAPI.getAnalysis();
        const cohortsData =
          cohortResponse.data?.cohorts || cohortResponse.data || [];
        setCohortData(Array.isArray(cohortsData) ? cohortsData : []);
      } catch (error) {
        console.log('Cohort data not available');
        setCohortData([]);
      }

      // Mock user growth data
      setUserGrowth([
        { month: 'Jan', users: 120, withPhones: 85 },
        { month: 'Feb', users: 190, withPhones: 145 },
        { month: 'Mar', users: 300, withPhones: 240 },
        { month: 'Apr', users: 450, withPhones: 380 },
        { month: 'May', users: 600, withPhones: 520 },
        { month: 'Jun', users: 750, withPhones: 680 },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Process phone data by cohort
  const getPhoneDataByCohort = () => {
    if (phoneData.length === 0) return [];

    const cohortCounts = {};
    phoneData.forEach((user) => {
      cohortCounts[user.cohort] = (cohortCounts[user.cohort] || 0) + 1;
    });

    return Object.entries(cohortCounts).map(([cohort, count]) => ({
      cohort,
      phoneCount: count,
    }));
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const phoneDataByCohort = getPhoneDataByCohort();

  return (
    <div>
      <h1>📊 Complete Analytics Dashboard</h1>

      {/* Enhanced Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <Users size={20} style={{ color: '#007bff' }} />
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              Total Users
            </span>
          </div>
          <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
          <div className="stat-label">Registered Users</div>
        </div>

        <div className="stat-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <Phone size={20} style={{ color: '#28a745' }} />
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              Phone Numbers
            </span>
          </div>
          <div className="stat-value">
            {stats.usersWithPhones.toLocaleString()}
          </div>
          <div className="stat-label">{stats.phonePercentage}% Coverage</div>
        </div>

        <div className="stat-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <ShoppingCart size={20} style={{ color: '#ffc107' }} />
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              Total Orders
            </span>
          </div>
          <div className="stat-value">{stats.totalOrders.toLocaleString()}</div>
          <div className="stat-label">All Time Orders</div>
        </div>

        <div className="stat-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <DollarSign size={20} style={{ color: '#dc3545' }} />
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              Total Revenue
            </span>
          </div>
          <div className="stat-value">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="stat-label">Lifetime Value</div>
        </div>

        <div className="stat-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <TrendingUp size={20} style={{ color: '#6f42c1' }} />
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              Avg Order Value
            </span>
          </div>
          <div className="stat-value">
            ${stats.averageOrderValue.toFixed(2)}
          </div>
          <div className="stat-label">Per Transaction</div>
        </div>

        <div className="stat-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <Phone size={20} style={{ color: '#17a2b8' }} />
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              Contact Rate
            </span>
          </div>
          <div className="stat-value">{stats.phonePercentage}%</div>
          <div className="stat-label">Users Reachable</div>
        </div>
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* User Growth with Phone Coverage */}
        <div className="card">
          <h3>📈 User Growth & Phone Coverage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#007bff"
                strokeWidth={2}
                name="Total Users"
              />
              <Line
                type="monotone"
                dataKey="withPhones"
                stroke="#28a745"
                strokeWidth={2}
                name="With Phone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Phone Numbers by Cohort */}
        <div className="card">
          <h3>📱 Phone Numbers by Cohort</h3>
          {phoneDataByCohort.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={phoneDataByCohort}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="cohort"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="phoneCount" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{ textAlign: 'center', padding: '50px', color: '#666' }}
            >
              No phone data available
            </div>
          )}
        </div>
      </div>

      {/* Cohort Distribution */}
      {cohortData.length > 0 && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>🎯 Cohort Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cohortData.slice(0, 5)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ cohort, value }) => `${cohort}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="userCount"
              >
                {cohortData.slice(0, 5).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Phone Numbers Summary */}
      {phoneData.length > 0 && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>📞 Recent Phone Numbers</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '15px',
            }}
          >
            {phoneData.slice(0, 6).map((user, index) => (
              <div
                key={index}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {user.name}
                </div>
                <div
                  style={{
                    color: '#666',
                    fontSize: '0.9rem',
                    marginBottom: '5px',
                  }}
                >
                  {user.email}
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    color: '#28a745',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Phone size={14} />
                  {user.phone}
                </div>
                <div
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    backgroundColor:
                      user.cohort === 'High Spender' ? '#d4edda' : '#fff3cd',
                    color:
                      user.cohort === 'High Spender' ? '#155724' : '#856404',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                  }}
                >
                  {user.cohort}
                </div>
              </div>
            ))}
          </div>

          {phoneData.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button
                className="btn btn-primary"
                onClick={() => (window.location.href = '/phones')}
              >
                View All {phoneData.length} Phone Numbers
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3>⚡ Quick Actions</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
          }}
        >
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = '/users')}
            style={{ padding: '15px', fontSize: '16px' }}
          >
            <Users size={18} style={{ marginRight: '8px' }} />
            Manage Users ({stats.totalUsers})
          </button>

          <button
            className="btn btn-success"
            onClick={() => (window.location.href = '/phones')}
            style={{ padding: '15px', fontSize: '16px' }}
          >
            <Phone size={18} style={{ marginRight: '8px' }} />
            Phone Directory ({stats.usersWithPhones})
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => (window.location.href = '/orders')}
            style={{ padding: '15px', fontSize: '16px' }}
          >
            <ShoppingCart size={18} style={{ marginRight: '8px' }} />
            View Orders ({stats.totalOrders})
          </button>

          <button
            className="btn"
            onClick={() => (window.location.href = '/cohorts')}
            style={{
              padding: '15px',
              fontSize: '16px',
              backgroundColor: '#6f42c1',
              color: 'white',
            }}
          >
            <TrendingUp size={18} style={{ marginRight: '8px' }} />
            Analyze Cohorts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
