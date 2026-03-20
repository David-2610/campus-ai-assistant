import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { RESOURCE_TYPES, BRANCHES, SEMESTERS, EXAM_TYPES, YEARS } from '../utils/constants';

const Upload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [form, setForm] = useState({
    title: '',
    type: '',
    subject: '',
    branch: '',
    semester: '',
    year: '',
    examType: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, file }));
    if (formErrors.file) {
      setFormErrors(prev => ({ ...prev, file: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.type) errors.type = 'Resource type is required';
    if (!form.subject.trim()) errors.subject = 'Subject is required';
    if (!form.branch) errors.branch = 'Branch is required';
    if (!form.semester) errors.semester = 'Semester is required';
    if (!form.year) errors.year = 'Year is required';
    if (!form.examType) errors.examType = 'Exam type is required';
    if (!form.file) errors.file = 'Please select a file to upload';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('type', form.type);
      formData.append('subject', form.subject);
      formData.append('branch', form.branch);
      formData.append('semester', form.semester);
      formData.append('year', form.year);
      formData.append('examType', form.examType);
      formData.append('file', form.file);

      await api.post('/resources/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Resource uploaded successfully! It will be reviewed by an admin.');
      
      // Reset form
      setForm({
        title: '',
        type: '',
        subject: '',
        branch: '',
        semester: '',
        year: '',
        examType: '',
        file: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      const message = err.response?.data?.message || 'Failed to upload resource. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Resource</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter resource title"
          required
          error={formErrors.title}
        />

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Resource Type <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select type</option>
            {RESOURCE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {formErrors.type && (
            <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
          )}
        </div>

        <Input
          label="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Enter subject name"
          required
          error={formErrors.subject}
        />

        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
            Branch <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="branch"
            name="branch"
            value={form.branch}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.branch ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select branch</option>
            {BRANCHES.map(branch => (
              <option key={branch.value} value={branch.value}>{branch.label}</option>
            ))}
          </select>
          {formErrors.branch && (
            <p className="mt-1 text-sm text-red-600">{formErrors.branch}</p>
          )}
        </div>

        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
            Semester <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="semester"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.semester ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select semester</option>
            {SEMESTERS.map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
          {formErrors.semester && (
            <p className="mt-1 text-sm text-red-600">{formErrors.semester}</p>
          )}
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="year"
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.year ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select year</option>
            {YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {formErrors.year && (
            <p className="mt-1 text-sm text-red-600">{formErrors.year}</p>
          )}
        </div>

        <div>
          <label htmlFor="examType" className="block text-sm font-medium text-gray-700 mb-1">
            Exam Type <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="examType"
            name="examType"
            value={form.examType}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.examType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select exam type</option>
            {EXAM_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {formErrors.examType && (
            <p className="mt-1 text-sm text-red-600">{formErrors.examType}</p>
          )}
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            File <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.file ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.file && (
            <p className="mt-1 text-sm text-red-600">{formErrors.file}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Upload PDF, DOC, DOCX, or image files
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? <LoadingSpinner size="small" /> : 'Upload Resource'}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/resources')}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
