import { useState, useEffect } from 'react';
import api from '@/api/api';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotices(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackView = async (id) => {
    try {
      // Keep track of viewed notices in session storage to not spam backends
      const viewed = JSON.parse(sessionStorage.getItem('viewedNotices') || '[]');
      if (!viewed.includes(id)) {
        await api.patch(`/notifications/${id}/view`);
        viewed.push(id);
        sessionStorage.setItem('viewedNotices', JSON.stringify(viewed));
        
        // Optimistically update UI count if we are going to show it here
        setNotices(prev => prev.map(n => n._id === id ? { ...n, views: (n.views || 0) + 1 } : n));
      }
    } catch (err) {
      console.log('Failed to track view');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'event': return 'bg-brand-orange text-white';
      case 'deadline': return 'bg-brand-maroon text-white';
      default: return 'bg-brand-peach text-brand-dark';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Campus Notice Board</h1>
        <p className="text-brand-maroon/70">Stay updated with the latest announcements, events, and deadlines.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}

      {notices.length === 0 && !error ? (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-brand-peach/20">
          {/* using empty state illustration or nice text */}
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-brand-dark mb-2">No new notices</h3>
          <p className="text-brand-maroon/60">You're all caught up! Check back later.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notices.map((notice) => (
            <div 
              key={notice._id} 
              onMouseEnter={() => handleTrackView(notice._id)}
              className="bg-white rounded-xl shadow-sm border border-brand-peach/30 overflow-hidden hover:shadow-md transition-shadow cursor-default"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-brand-dark leading-tight">{notice.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${getCategoryColor(notice.category)}`}>
                    {notice.category}
                  </span>
                </div>
                
                <p className="text-brand-dark/80 whitespace-pre-wrap mb-6 leading-relaxed">
                  {notice.content}
                </p>

                <div className="flex flex-wrap gap-3 text-sm">
                  {notice.targetBranch && (
                    <div className="flex items-center text-brand-maroon/70 bg-brand-light px-3 py-1 rounded-md">
                      <span className="font-semibold mr-1">Branch:</span> {notice.targetBranch}
                    </div>
                  )}
                  {notice.targetYear && (
                    <div className="flex items-center text-brand-maroon/70 bg-brand-light px-3 py-1 rounded-md">
                      <span className="font-semibold mr-1">Year:</span> {notice.targetYear}
                    </div>
                  )}
                  {notice.expiresAt && (
                    <div className="flex items-center text-brand-orange bg-brand-light px-3 py-1 rounded-md ml-auto">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold mr-1">Exp:</span> 
                      {new Date(notice.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-brand-light/50 px-6 py-3 border-t border-brand-peach/20 text-xs text-brand-maroon/50 flex justify-between items-center">
                <span>Posted {new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;