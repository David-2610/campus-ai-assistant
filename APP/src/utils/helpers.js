// Utility / helper functions

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getCategoryColor = (category) => {
  switch (category) {
    case 'event':
      return { bg: '#D35400', text: '#FFFFFF' };
    case 'deadline':
      return { bg: '#5D4037', text: '#FFFFFF' };
    default:
      return { bg: '#F5B041', text: '#2C1810' };
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return { bg: '#FEF9E7', text: '#F39C12', border: '#F9E79F' };
    case 'approved':
      return { bg: '#EAFAF1', text: '#27AE60', border: '#A9DFBF' };
    case 'rejected':
      return { bg: '#FDEDEC', text: '#E74C3C', border: '#F5B7B1' };
    case 'resolved':
      return { bg: '#EAFAF1', text: '#27AE60', border: '#A9DFBF' };
    case 'dismissed':
      return { bg: '#F5F5F5', text: '#757575', border: '#E0E0E0' };
    default:
      return { bg: '#F5F5F5', text: '#757575', border: '#E0E0E0' };
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
