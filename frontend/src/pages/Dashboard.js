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
} from 'recharts';
import { usersAPI, ordersAPI, cohortsAPI } from '../services/api';
import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalPhoneNumbers: 0,
    phonesCoverage: 0,
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

      // Fetch stats
      const [usersResponse, ordersResponse, phonesResponse] = await Promise.all([
        usersAPI.getStats(),
        ordersAPI.getStats(),
        usersAPI.getPhoneNumbers().catch(() => ({ data: { phones: [] } }))
      ]);

      const phoneNumbers = phonesResponse.data.phones || [];
      const phonesCoverage = stats.totalUsers > 0 ? (phoneNumbers.length / usersResponse.data.totalUsers * 100) : 0;

      setStats({
        totalUsers: usersResponse.data.totalUsers || 0,
        totalOrders: ordersResponse.data.totalOrders || 0,
        totalRevenue: ordersResponse.data.totalRevenue || 0,
        averageOrderValue: ordersResponse.data.averageOrderValue || 0,
        totalPhoneNumbers: phoneNumbers.length,
        phonesCoverage: phonesCoverage,
      });

      setPhoneData(phoneNumbers);

      // Fetch cohort analysis
      try {
        const cohortResponse = await cohortsAPI.getAnalysis();
        setCohortData(cohortResponse.data.cohorts || []);
      } catch (error) {
        console.log('Cohort data not available');
      }

      // Mock user growth data
      setUserGrowth([
        { month: 'Jan', users: 120 },
        { month: 'Feb', users: 190 },
        { month: 'Mar', users: 300 },
        { month: 'Apr', users: 450 },
        { month: 'May', users: 600 },
        { month: 'Jun', users: 750 },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalPhoneNumbers.toLocaleString()}</div>
          <div className="stat-label">Phone Numbers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalOrders.toLocaleString()}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            ${stats.averageOrderValue.toFixed(2)}
          </div>
          <div className="stat-label">Avg Order Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.phonesCoverage.toFixed(1)}%</div>
          <div className="stat-label">Phone Coverage</div>
        </div>
      </div>

      {/* Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* User Growth Chart */}
        <div className="card">
          <h3>User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cohort Distribution */}
        <div className="card">
          <h3>Cohort Distribution</h3>
          {cohortData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cohortData.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ cohort }) => cohort}
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
          ) : (
            <div
              style={{ textAlign: 'center', padding: '50px', color: '#666' }}
            >
              No cohort data available
            </div>
          )}
        </div>
      </div>

      {/* Phone Numbers Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Phone Coverage Chart */}
        <div className="card">
          <h3>Phone Number Coverage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'With Phone', value: stats.totalPhoneNumbers, fill: '#28a745' },
                  { name: 'Without Phone', value: stats.totalUsers - stats.totalPhoneNumbers, fill: '#dc3545' }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                dataKey="value"
              >
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Phone by Cohort */}
        <div className="card">
          <h3>Phone Numbers by Cohort</h3>
          {phoneData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={
                Object.entries(
                  phoneData.reduce((acc, user) => {
                    acc[user.cohort] = (acc[user.cohort] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([cohort, count]) => ({ cohort, count }))
              }>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cohort" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#17a2b8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              No phone data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = '/users')}
          >
            Manage Users
          </button>
          <button
            className="btn btn-success"
            onClick={() => (window.location.href = '/phones')}
          >
            View Phone Numbers
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => (window.location.href = '/orders')}
          >
            View Orders
          </button>
          <button
            className="btn btn-info"
            onClick={() => (window.location.href = '/cohorts')}
          >
            Analyze Cohorts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
