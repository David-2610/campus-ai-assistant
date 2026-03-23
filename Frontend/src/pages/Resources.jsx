import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import ResourceCard from '../components/ui/ResourceCard';
import FilterBar from '../components/ui/FilterBar';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    subject: '',
    branch: '',
    semester: '',
    year: '',
    examType: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort
      };

      // Add filters to params if they have values
      if (filters.type) params.type = filters.type;
      if (filters.subject) params.subject = filters.subject;
      if (filters.branch) params.branch = filters.branch;
      if (filters.semester) params.semester = filters.semester;
      if (filters.year) params.year = filters.year;
      if (filters.examType) params.examType = filters.examType;
      if (filters.search) params.search = filters.search;

      const response = await api.get('/resources', { params });

      setResources(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch resources';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, sort]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
    // Reset to page 1 when filters change
    setPagination({
      ...pagination,
      page: 1
    });
  };

  const handleResetFilters = () => {
    setFilters({
      type: '',
      subject: '',
      branch: '',
      semester: '',
      year: '',
      examType: '',
      search: ''
    });
    setPagination({
      ...pagination,
      page: 1
    });
  };

  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      page
    });
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPagination({
      ...pagination,
      page: 1
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Resources</h1>
        <p className="text-gray-600">
          Explore and download educational materials shared by the community
        </p>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-700">
          {pagination.total > 0 ? (
            <span>
              Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} resources
            </span>
          ) : (
            <span>No resources found</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-gray-700 font-medium">
            Sort by:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-brand-peach/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all bg-brand-light/30"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No resources found</p>
          <p className="text-gray-400 mt-2">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Resources;
