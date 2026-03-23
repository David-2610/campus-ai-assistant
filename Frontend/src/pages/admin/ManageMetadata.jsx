import { useState, useEffect } from 'react';
import api from '@/api/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ManageMetadata = () => {
  const [metadata, setMetadata] = useState({ branch: [], subject: [], type: [], examType: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('branch');
  const [error, setError] = useState(null);
  
  // Form State
  const [form, setForm] = useState({ type: 'branch', value: '', priority: 0 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/metadata');
      setMetadata({
        branch: data.branch || [],
        subject: data.subject || [],
        type: data.type || [],
        examType: data.examType || []
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setForm(prev => ({ ...prev, type: tab, value: '', priority: 0 }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.value.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        type: form.type,
        value: form.value.trim(),
        priority: parseInt(form.priority, 10) || 0
      };
      await api.post('/admin/metadata', payload);
      setForm(prev => ({ ...prev, value: '', priority: 0 }));
      fetchMetadata(); // Refresh lists
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add metadata');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this specific metadata?')) return;
    try {
      await api.delete(`/admin/metadata/${id}`);
      fetchMetadata();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete metadata');
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await api.patch(`/admin/metadata/${item._id}`, { isActive: !item.isActive });
      fetchMetadata();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update metadata');
    }
  };

  const tabs = [
    { id: 'branch', label: 'Branches' },
    { id: 'subject', label: 'Subjects' },
    { id: 'type', label: 'Resource Types' },
    { id: 'examType', label: 'Exam Types' }
  ];

  if (loading && !metadata[activeTab].length) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8 border-b border-brand-peach/30 pb-4">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Manage Metadata</h1>
        <p className="text-brand-maroon/70">Add, edit, or remove dropdown options dynamically used across the platform.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm ${
              activeTab === tab.id
                ? 'bg-brand-orange text-white ring-2 ring-brand-orange/20 ring-offset-2'
                : 'bg-white text-brand-dark border border-brand-peach/40 hover:bg-brand-light/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* List Section */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-brand-peach/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-peach/30 bg-brand-light/30">
            <h2 className="text-lg font-bold text-brand-dark capitalize">{activeTab} Entries</h2>
          </div>
          
          <div className="divide-y divide-brand-peach/20 max-h-[600px] overflow-y-auto">
            {metadata[activeTab].length === 0 ? (
              <div className="p-8 text-center text-brand-maroon/50">
                No entries found. Add one below.
              </div>
            ) : (
              metadata[activeTab].map(item => (
                <div key={item._id} className={`p-4 flex items-center justify-between transition-colors ${!item.isActive ? 'bg-gray-50 opacity-70' : 'hover:bg-brand-light/20'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-brand-dark">{item.value}</span>
                      {!item.isActive && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-600 rounded">Inactive</span>
                      )}
                    </div>
                    <div className="text-xs text-brand-maroon/60 mt-1 font-medium">
                      Priority: {item.priority}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`text-xs px-3 py-1.5 rounded font-bold border transition-colors ${
                        item.isActive 
                          ? 'bg-brand-light text-brand-maroon border-brand-peach/40 hover:bg-brand-peach/30' 
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      }`}
                    >
                      {item.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-xs px-3 py-1.5 rounded font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add New Section */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-peach/30 p-6 h-fit sticky top-6">
          <h2 className="text-lg font-bold text-brand-dark mb-4 border-b border-brand-peach/30 pb-2">Add New {activeTab}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Value Name"
              name="value"
              value={form.value}
              onChange={(e) => setForm(prev => ({ ...prev, value: e.target.value }))}
              placeholder={`e.g. ${activeTab === 'branch' ? 'Computer Science' : activeTab === 'semester' ? '1' : 'Sample'}`}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Sorting Priority
              </label>
              <input
                type="number"
                value={form.priority}
                onChange={(e) => setForm(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full mb-3 p-3 border-2 border-brand-peach/40 rounded-lg focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/20 outline-none transition-all"
                placeholder="0"
              />
              <p className="text-xs text-brand-maroon/60 font-medium">Higher numbers appear first in dropdowns.</p>
            </div>

            <Button
              type="submit"
              disabled={submitting || !form.value.trim()}
              className="w-full bg-brand-maroon hover:bg-brand-dark shadow-md focus:ring-brand-maroon/20 py-3"
            >
              {submitting ? <LoadingSpinner size="small" /> : 'Add Entry'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageMetadata;
