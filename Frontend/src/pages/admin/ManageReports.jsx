import { useState, useEffect } from 'react';
import api from '../../api/api';
import Button from '../../components/ui/Button';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/reports');
      setReports(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await api.patch(`/admin/reports/${reportId}/resolve`, { status: newStatus });
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report status');
    }
  };

  const handleDeleteResource = async (resourceId, reportId) => {
    if (!window.confirm("Are you sure you want to delete the underlying resource? This cannot be undone.")) return;
    try {
      // First delete resource
      await api.delete(`/admin/resources/${resourceId}`);
      // Then mark report resolved
      await api.patch(`/admin/reports/${reportId}/resolve`, { status: 'resolved' });
      fetchReports();
      alert("Resource deleted and report resolved.");
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Resource Reports</h1>
        <p className="text-brand-maroon/70 mt-1">Review flagged content and take moderation actions</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-brand-peach/30 text-center text-brand-dark/50 italic">
              No reports found. Great job!
            </div>
          ) : (
            reports.map(report => (
              <div key={report._id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 ${report.status === 'pending' ? 'border-red-300' : 'border-brand-peach/30 opacity-70'}`}>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      report.status === 'pending' ? 'bg-red-100 text-red-700' : 
                      report.status === 'resolved' ? 'bg-green-100 text-green-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-sm text-brand-dark/50">
                      Reported on {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-brand-dark">
                    Target: {report.resourceId ? report.resourceId.title : <span className="text-red-500 italic">Deleted Resource</span>}
                  </h3>
                  
                  {report.resourceId && (
                    <p className="text-sm text-brand-maroon mb-3 font-semibold">
                      {report.resourceId.type} • {report.resourceId.branch} • Sem {report.resourceId.semester}
                    </p>
                  )}
                  
                  <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-red-800 mb-1">Reason provided by <span className="underline">{report.reportedBy?.name || 'Unknown User'}</span>:</p>
                    <p className="text-red-700 italic">"{report.reason}"</p>
                  </div>
                </div>

                {report.status === 'pending' && (
                  <div className="flex md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-brand-peach/30 pt-4 md:pt-0 md:pl-6">
                    {report.resourceId && (
                      <Button
                        onClick={() => handleDeleteResource(report.resourceId._id, report._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm py-2"
                      >
                        Delete Resource
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => handleStatusChange(report._id, 'dismissed')}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm py-2"
                    >
                      Dismiss Report
                    </Button>
                    {!report.resourceId && (
                      <Button
                        onClick={() => handleStatusChange(report._id, 'resolved')}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm py-2"
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageReports;
