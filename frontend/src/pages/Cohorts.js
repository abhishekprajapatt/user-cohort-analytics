import React, { useState, useEffect } from 'react';
import { cohortsAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { RefreshCw, BarChart3 } from 'lucide-react';

const Cohorts = () => {
  const [cohorts, setCohorts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchCohortData();
  }, []);

  const fetchCohortData = async () => {
    try {
      setLoading(true);
      const [cohortsResponse, metricsResponse, analysisResponse] =
        await Promise.all([
          cohortsAPI.getAll().catch(() => ({ data: [] })),
          cohortsAPI.getMetrics().catch(() => ({ data: null })),
          cohortsAPI.getAnalysis().catch(() => ({ data: null })),
        ]);

      setCohorts(cohortsResponse.data || []);
      setMetrics(metricsResponse.data);
      setAnalysis(analysisResponse.data);
    } catch (error) {
      console.error('Error fetching cohort data:', error);
      toast.error('Failed to load cohort data');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateCohorts = async () => {
    try {
      setCalculating(true);
      await cohortsAPI.calculate();
      toast.success('Cohorts calculated successfully');
      fetchCohortData();
    } catch (error) {
      console.error('Error calculating cohorts:', error);
      toast.error('Failed to calculate cohorts');
    } finally {
      setCalculating(false);
    }
  };

  const formatCohortData = () => {
    if (!cohorts || cohorts.length === 0) return [];

    return cohorts.map((cohort) => ({
      cohort: cohort.cohort || 'Unknown',
      userCount: cohort.userCount || 0,
      totalRevenue: cohort.totalRevenue || 0,
      averageOrderValue: cohort.averageOrderValue || 0,
    }));
  };

  const getRetentionData = () => {
    if (!analysis || !analysis.retention) return [];

    return Object.entries(analysis.retention).map(([period, rate]) => ({
      period,
      retentionRate: (rate * 100).toFixed(1),
    }));
  };

  if (loading) {
    return <div className="loading">Loading cohort data...</div>;
  }

  const chartData = formatCohortData();
  const retentionData = getRetentionData();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1>Cohort Analysis</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={fetchCohortData}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCalculateCohorts}
            disabled={calculating}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <BarChart3 size={16} />
            {calculating ? 'Calculating...' : 'Calculate Cohorts'}
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="stats-grid" style={{ marginBottom: '30px' }}>
          <div className="stat-card">
            <div className="stat-value">{metrics.totalCohorts || 0}</div>
            <div className="stat-label">Total Cohorts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{metrics.averageCohortSize || 0}</div>
            <div className="stat-label">Avg Cohort Size</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              ${(metrics.totalCohortRevenue || 0).toLocaleString()}
            </div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {((metrics.retentionRate || 0) * 100).toFixed(1)}%
            </div>
            <div className="stat-label">Retention Rate</div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Cohort User Count Chart */}
        <div className="card">
          <h3>Cohort User Distribution</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cohort" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="userCount" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{ textAlign: 'center', padding: '50px', color: '#666' }}
            >
              No cohort data available. Click "Calculate Cohorts" to generate
              analysis.
            </div>
          )}
        </div>

        {/* Retention Rate Chart */}
        <div className="card">
          <h3>Retention Rates</h3>
          {retentionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Retention Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="retentionRate"
                  stroke="#28a745"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{ textAlign: 'center', padding: '50px', color: '#666' }}
            >
              No retention data available
            </div>
          )}
        </div>
      </div>

      {/* Cohort Revenue Chart */}
      {chartData.length > 0 && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>Cohort Revenue Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cohort" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="totalRevenue" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cohort Table */}
      <div className="card">
        <h3>Cohort Details</h3>
        {cohorts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No cohort data available.</p>
            <p>
              Click "Calculate Cohorts" to analyze your user data and generate
              cohort insights.
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Cohort</th>
                <th>User Count</th>
                <th>Total Revenue</th>
                <th>Avg Order Value</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((cohort, index) => (
                <tr key={index}>
                  <td>{cohort.cohort || 'Unknown'}</td>
                  <td>{cohort.userCount || 0}</td>
                  <td>${(cohort.totalRevenue || 0).toLocaleString()}</td>
                  <td>${(cohort.averageOrderValue || 0).toFixed(2)}</td>
                  <td>
                    {cohort.createdAt
                      ? new Date(cohort.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Analysis Summary */}
      {analysis && (
        <div className="card">
          <h3>Analysis Summary</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
            }}
          >
            <div>
              <strong>Most Active Cohort:</strong>
              <p>{analysis.mostActiveCohort || 'N/A'}</p>
            </div>
            <div>
              <strong>Highest Revenue Cohort:</strong>
              <p>{analysis.highestRevenueCohort || 'N/A'}</p>
            </div>
            <div>
              <strong>Analysis Date:</strong>
              <p>
                {analysis.analysisDate
                  ? new Date(analysis.analysisDate).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cohorts;
