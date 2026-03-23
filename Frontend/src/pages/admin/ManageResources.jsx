import { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ManageResources = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/resources/${activeTab}`);
      setResources(response.data.data || response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch resources';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleApprove = async (resourceId) => {
    if (!window.confirm('Are you sure you want to approve this resource?')) {
      return;
    }

    try {
      setActionLoading(resourceId);
      await api.patch(`/admin/resources/${resourceId}/approve`);
      await fetchResources();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to approve resource';
      alert(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (resourceId) => {
    if (!window.confirm('Are you sure you want to reject this resource?')) {
      return;
    }

    try {
      setActionLoading(resourceId);
      await api.patch(`/admin/resources/${resourceId}/reject`);
      await fetchResources();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reject resource';
      alert(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(resourceId);
      await api.delete(`/admin/resources/${resourceId}`);
      await fetchResources();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete resource';
      alert(message);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-dark mb-8 border-b border-brand-peach/30 pb-4">Manage Uploaded Resources</h1>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-brand-peach/30">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 border-b-4 font-bold text-sm transition-colors ${
              activeTab === 'pending'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-gray-500 hover:text-brand-dark hover:border-brand-peach'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`py-4 px-1 border-b-4 font-bold text-sm transition-colors ${
              activeTab === 'approved'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-gray-500 hover:text-brand-dark hover:border-brand-peach'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`py-4 px-1 border-b-4 font-bold text-sm transition-colors ${
              activeTab === 'rejected'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-gray-500 hover:text-brand-dark hover:border-brand-peach'
            }`}
          >
            Rejected
          </button>
        </nav>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Resources Table */}
      {!loading && !error && (
        <>
          {resources.length === 0 ? (
            <div className="text-center py-12 bg-brand-light/20 rounded-xl border border-brand-peach/30 shadow-sm">
              <p className="text-brand-maroon/60 font-medium text-lg">No {activeTab} resources found</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-brand-peach/30">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-peach/20">
                  <thead className="bg-brand-light/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Semester
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Exam Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Uploaded By
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-brand-peach/20">
                    {resources.map((resource) => (
                      <tr key={resource._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{resource.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{resource.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{resource.branch}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{resource.semester}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{resource.year}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{resource.examType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {resource.uploadedBy?.name || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(resource.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {activeTab === 'pending' && (
                              <>
                                <Button
                                  onClick={() => handleApprove(resource._id)}
                                  variant="primary"
                                  disabled={actionLoading === resource._id}
                                  className="text-xs px-3 py-1"
                                >
                                  {actionLoading === resource._id ? 'Processing...' : 'Approve'}
                                </Button>
                                <Button
                                  onClick={() => handleReject(resource._id)}
                                  variant="secondary"
                                  disabled={actionLoading === resource._id}
                                  className="text-xs px-3 py-1"
                                >
                                  {actionLoading === resource._id ? 'Processing...' : 'Reject'}
                                </Button>
                              </>
                            )}
                            <Button
                              onClick={() => handleDelete(resource._id)}
                              variant="danger"
                              disabled={actionLoading === resource._id}
                              className="text-xs px-3 py-1"
                            >
                              {actionLoading === resource._id ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageResources;
