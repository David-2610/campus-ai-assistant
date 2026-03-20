const ResourceCard = ({ resource }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Type:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{resource.type}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Subject:</span>
          <span>{resource.subject}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Branch:</span> {resource.branch}
          </div>
          <div>
            <span className="font-medium">Semester:</span> {resource.semester}
          </div>
          <div>
            <span className="font-medium">Year:</span> {resource.year}
          </div>
          <div>
            <span className="font-medium">Exam:</span> {resource.examType}
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <span>Uploaded by: {resource.uploadedBy?.name || 'Unknown'}</span>
          <span>{formatDate(resource.createdAt)}</span>
        </div>
        
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;
