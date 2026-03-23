import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalResources: 0,
    pendingResources: 0,
    approvedResources: 0,
    rejectedResources: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/stats');
      setStats(response.data);
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

      <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-peach/30 mt-8">
        <h2 className="text-xl font-bold text-brand-dark mb-6 border-b border-brand-peach/20 pb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => navigate('/admin/resources')}
            className="bg-brand-maroon hover:bg-brand-dark text-white px-6 py-3 font-bold"
          >
            Manage Resources
          </Button>
          <Button 
            onClick={() => navigate('/admin/metadata')}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-3 font-bold"
          >
            Manage Metadata
          </Button>
          <Button 
            onClick={() => navigate('/admin/notifications')}
            className="bg-brand-light hover:bg-brand-peach/20 text-brand-maroon border border-brand-peach/40 px-6 py-3 font-bold"
          >
            Manage Notices
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
