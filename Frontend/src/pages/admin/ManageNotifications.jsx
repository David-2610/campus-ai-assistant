import { useState, useEffect } from 'react';
import api from '@/api/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ManageNotifications = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'notice',
    targetBranch: '',
    targetYear: '',
    expiresAt: '' // We will let the backend default it if empty, or we can send it
  });

  const categories = ['notice', 'event', 'deadline'];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await api.get('/api/notifications');
      setNotices(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // clean up empty fields
      const payload = { ...form };
      if (!payload.targetBranch) delete payload.targetBranch;
      if (!payload.targetYear) delete payload.targetYear;
      if (!payload.expiresAt) delete payload.expiresAt;

      await api.post('/api/admin/notifications', payload);
      setSuccess('Notice created successfully!');
      
      // Reset form
      setForm({
        title: '',
        content: '',
        category: 'notice',
        targetBranch: '',
        targetYear: '',
        expiresAt: ''
      });
      
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice permanently?')) return;
    try {
      await api.delete(`/api/admin/notifications/${id}`);
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notice');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'event': return 'bg-brand-orange text-white';
      case 'deadline': return 'bg-brand-maroon text-white';
      default: return 'bg-brand-peach text-brand-dark';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8 border-b border-brand-peach/30 pb-4">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Manage Notices</h1>
        <p className="text-brand-maroon/70">Create, broadcast, and delete announcements on the home feed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-brand-peach/30 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-brand-dark mb-4 border-b border-brand-peach/20 pb-2">Post New Notice</h2>
            
            {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-4 border border-red-200">{error}</div>}
            {success && <div className="text-green-700 bg-green-50 p-3 rounded-lg text-sm mb-4 border border-green-200">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Notice Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. End Semester Exams"
                required
              />

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Content <span className="text-brand-orange">*</span></label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 border-2 border-brand-peach/40 rounded-lg focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/20 outline-none transition-all resize-none"
                  placeholder="Details of the announcement..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-brand-light/30 border border-brand-peach/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium capitalize"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Target Branch</label>
                  <Input
                    name="targetBranch"
                    value={form.targetBranch}
                    onChange={handleChange}
                    placeholder="e.g. CSE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Target Year</label>
                  <Input
                    type="number"
                    name="targetYear"
                    value={form.targetYear}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Expiration Date (Optional)</label>
                <Input
                  type="datetime-local"
                  name="expiresAt"
                  value={form.expiresAt}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-maroon hover:bg-brand-dark text-white shadow-md focus:ring-brand-maroon/20 py-3 mt-4"
              >
                {submitting ? <LoadingSpinner size="small" /> : 'Broadcast Notice'}
              </Button>
            </form>
          </div>
        </div>

        {/* Notice List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-brand-dark">Active Notices</h2>
            <span className="bg-brand-light text-brand-maroon font-bold px-3 py-1 rounded-full text-sm border border-brand-peach/30">{notices.length} Total</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner size="large" />
            </div>
          ) : notices.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-brand-peach/30">
              <p className="text-brand-maroon/60">No active notices found.</p>
            </div>
          ) : (
            notices.map(notice => (
              <div key={notice._id} className="bg-white rounded-xl shadow-sm border border-brand-peach/30 p-5 hover:border-brand-peach transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-2 ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                    <h3 className="text-lg font-bold text-brand-dark">{notice.title}</h3>
                  </div>
                  <button 
                    onClick={() => handleDelete(notice._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                    title="Delete Notice"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-sm text-brand-dark/70 mb-4 line-clamp-3">{notice.content}</p>
                
                <div className="flex flex-wrap gap-2 text-xs font-medium text-brand-maroon/60">
                  {notice.targetBranch && <span className="bg-brand-light px-2 py-1 rounded border border-brand-peach/20">Branch: {notice.targetBranch}</span>}
                  {notice.targetYear && <span className="bg-brand-light px-2 py-1 rounded border border-brand-peach/20">Year: {notice.targetYear}</span>}
                  {notice.expiresAt && <span className="bg-brand-orange/10 text-brand-orange px-2 py-1 rounded border border-brand-orange/20">Expires: {new Date(notice.expiresAt).toLocaleDateString()}</span>}
                </div>
                <div className="mt-3 pt-3 border-t border-brand-peach/20 text-xs text-brand-dark/40 flex justify-between">
                  <span>Author: {notice.createdBy?.name || 'Admin'}</span>
                  <span>Posted: {new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageNotifications;
