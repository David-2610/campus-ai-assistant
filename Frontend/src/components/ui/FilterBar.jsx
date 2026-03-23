import { RESOURCE_TYPES, BRANCHES, SEMESTERS, EXAM_TYPES, YEARS } from '../../utils/constants';

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  const handleSelectChange = (filterName, value) => {
    onFilterChange(filterName, value);
  };

  const handleSearchChange = (e) => {
    onFilterChange('search', e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {/* Search Input */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 bg-brand-light/30 border border-brand-peach/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleSelectChange('type', e.target.value)}
            className="w-full px-3 py-2 bg-brand-light/30 border border-brand-peach/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            placeholder="Enter subject"
            value={filters.subject || ''}
            onChange={(e) => handleSelectChange('subject', e.target.value)}
            className="w-full px-3 py-2 bg-brand-light/30 border border-brand-peach/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
          />
        </div>

        {/* Branch Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
          <select
            value={filters.branch || ''}
            onChange={(e) => handleSelectChange('branch', e.target.value)}
            className="w-full px-3 py-2 bg-brand-light/30 border border-brand-peach/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
          >
            <option value="">All Branches</option>
            {BRANCHES.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
          <select
            value={filters.semester || ''}
            onChange={(e) => handleSelectChange('semester', e.target.value)}
            className="w-full px-3 py-2 bg-brand-light/30 border border-brand-peach/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
          >
            <option value="">All Semesters</option>
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            value={filters.year || ''}
            onChange={(e) => handleSelectChange('year', e.target.value)}
            className="w-full px-3 py-2 bg-brand-light/30 border border-brand-peach/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
          >
            <option value="">All Years</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Exam Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
          <select
            value={filters.examType || ''}
            onChange={(e) => handleSelectChange('examType', e.target.value)}
            className="w-full px-3 py-2 bg-brand-light/30 border border-brand-peach/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
          >
            <option value="">All Exam Types</option>
            {EXAM_TYPES.map((exam) => (
              <option key={exam.value} value={exam.value}>
                {exam.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
