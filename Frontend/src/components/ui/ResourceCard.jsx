import api from '../../api/api';

const ResourceCard = ({ resource }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleReport = async () => {
    const reason = window.prompt("Why are you reporting this resource? (Provide a reason)");
    if (!reason) return;
    
    try {
      await api.post(`/resources/${resource._id}/report`, { reason });
      alert("Report submitted successfully. Admins will review it soon.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit report. You may have already reported it.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-brand-peach/30 p-6 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-xl font-bold text-brand-dark mb-2">{resource.title}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-brand-dark/80">
          <span className="font-semibold mr-2">Type:</span>
          <span className="px-3 py-1 bg-brand-light text-brand-maroon font-bold text-xs uppercase tracking-wide rounded-full">{resource.type}</span>
        </div>
        
        <div className="flex items-center text-sm text-brand-dark/80">
          <span className="font-semibold mr-2">Subject:</span>
          <span>{resource.subject}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-brand-dark/80">
          <div>
            <span className="font-semibold">Branch:</span> {resource.branch}
          </div>
          <div>
            <span className="font-semibold">Semester:</span> {resource.semester}
          </div>
          <div>
            <span className="font-semibold">Year:</span> {resource.year}
          </div>
          <div>
            <span className="font-semibold">Exam:</span> {resource.examType}
          </div>
        </div>
      </div>
      
      <div className="border-t border-brand-peach/30 pt-4 mt-4">
        <div className="flex justify-between items-center text-xs text-brand-maroon/60 mb-4 font-medium">
          <span>Uploaded by: {resource.uploadedBy?.name || 'Unknown'}</span>
          <span>{formatDate(resource.createdAt)}</span>
        </div>
        
        <div className="flex gap-2 mb-4">
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-brand-orange text-white font-bold py-2.5 rounded-lg shadow-sm hover:bg-brand-maroon transition-colors duration-200"
          >
            Download
          </a>
          <button
            onClick={handleReport}
            title="Report this resource"
            className="px-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
