import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#D35400', '#C0392B', '#E67E22', '#E74C3C', '#F39C12', '#9B59B6'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalResources: 0,
    pendingResources: 0,
    approvedResources: 0,
    rejectedResources: 0,
    totalUsers: 0
  });
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, analyticsRes, logsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/analytics'),
        api.get('/admin/audit-logs?limit=8')
      ]);
      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
      setAuditLogs(logsRes.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch statistics';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-dark mb-8 border-b border-brand-peach/30 pb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-peach/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brand-maroon/70 mb-1 uppercase tracking-wider">Total Resources</p>
              <p className="text-3xl font-bold text-brand-dark">{stats.totalResources}</p>
            </div>
            <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center border border-brand-peach/40">
              <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-peach/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brand-maroon/70 mb-1 uppercase tracking-wider">Pending Resources</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingResources}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center border border-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-peach/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brand-maroon/70 mb-1 uppercase tracking-wider">Approved Resources</p>
              <p className="text-3xl font-bold text-green-600">{stats.approvedResources}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-peach/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brand-maroon/70 mb-1 uppercase tracking-wider">Rejected Resources</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejectedResources}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-peach/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brand-maroon/70 mb-1 uppercase tracking-wider">Total Users</p>
              <p className="text-3xl font-bold text-brand-dark">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center border border-brand-peach/40">
              <svg className="w-6 h-6 text-brand-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Resources By Branch Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-peach/30 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-brand-dark mb-6 border-b border-brand-peach/20 pb-2">Resources By Branch</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.resourcesByBranch}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics.resourcesByBranch.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Resources']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resources By Type Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-peach/30 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-brand-dark mb-6 border-b border-brand-peach/20 pb-2">Resources By Type</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.resourcesByType} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#5D4037" tick={{ fill: '#5D4037' }} />
                  <YAxis stroke="#5D4037" tick={{ fill: '#5D4037' }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFF5F0', borderColor: '#F5B041', borderRadius: '8px' }}
                    cursor={{ fill: '#FDEBD0', opacity: 0.4 }}
                  />
                  <Bar dataKey="value" fill="#D35400" radius={[4, 4, 0, 0]} name="Resources" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Audit Logs / Recent Activity */}
      {auditLogs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-peach/30 mt-8 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-brand-dark mb-6 border-b border-brand-peach/20 pb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent System Activity
          </h2>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log._id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-brand-light/30 transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-orange flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">
                    <span className="text-brand-maroon">{log.adminId?.name || 'Unknown Admin'}</span> 
                    {' '}— {log.description}
                  </p>
                  <div className="flex gap-3 text-xs text-brand-dark/50 mt-1">
                    <span className="font-medium bg-brand-peach/20 text-brand-maroon px-2 py-0.5 rounded">{log.action.replace('_', ' ')}</span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-peach/30 mt-8">
        <h2 className="text-xl font-bold text-brand-dark mb-6 border-b border-brand-peach/20 pb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => navigate('/admin/resources')}
            className="bg-brand-maroon hover:bg-brand-dark text-white px-6 py-3 font-bold"
          >
            Manage Resources
          </Button>
          <Button onClick={() => navigate('/admin/metadata')} className="bg-brand-orange hover:bg-brand-maroon focus:ring-brand-orange/20 text-white font-bold transition-colors">
            Manage Metadata
          </Button>
          <Button onClick={() => navigate('/admin/notifications')} className="bg-brand-maroon hover:bg-brand-dark focus:ring-brand-maroon/20 text-white font-bold transition-colors">
            Manage Notice Board
          </Button>
          <Button onClick={() => navigate('/admin/users')} className="bg-brand-dark hover:bg-black focus:ring-brand-dark/20 text-white font-bold transition-colors">
            Manage Users & Batches
          </Button>
          <Button onClick={() => navigate('/admin/reports')} className="bg-red-500 hover:bg-red-600 focus:ring-red-500/20 text-white font-bold transition-colors">
            Manage Reports
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
