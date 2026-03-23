import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { SEMESTERS, YEARS } from '../utils/constants';

const Upload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [metadata, setMetadata] = useState({
    branch: [],
    subject: [],
    type: [],
    examType: []
  });

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

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const { data } = await api.get('/metadata');
      // data should be { branch: [...], subject: [...], type: [...], examType: [...] }
      setMetadata({
        branch: data.branch || [],
        subject: data.subject || [],
        type: data.type || [],
        examType: data.examType || []
      });
    } catch (err) {
      console.error('Failed to fetch metadata', err);
      setError('Could not load dynamic dropdown values. Some fields may be empty.');
    } finally {
      setMetadataLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
    if (!form.subject) errors.subject = 'Subject is required';
    if (!form.branch) errors.branch = 'Branch is required';
    if (!form.semester) errors.semester = 'Semester is required';
    if (!form.year) errors.year = 'Year is required';
    if (!form.examType) errors.examType = 'Exam type is required';
    if (!form.file) errors.file = 'Please select a file to upload';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Resource uploaded successfully! It will be reviewed by an admin.');
      setForm({
        title: '', type: '', subject: '', branch: '', semester: '', year: '', examType: '', file: null
      });
      
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (metadataLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Upload Resource</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-brand-peach/20">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter resource title"
          required
          error={formErrors.title}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-brand-dark mb-1">
              Resource Type <span className="text-brand-orange ml-1">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-brand-light/30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all ${
                formErrors.type ? 'border-red-500' : 'border-brand-peach/40'
              }`}
            >
              <option value="">Select type</option>
              {metadata.type.map(item => (
                <option key={item._id} value={item.value}>{item.value}</option>
              ))}
            </select>
            {formErrors.type && <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-brand-dark mb-1">
              Subject <span className="text-brand-orange ml-1">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-brand-light/30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all ${
                formErrors.subject ? 'border-red-500' : 'border-brand-peach/40'
              }`}
            >
              <option value="">Select subject</option>
              {metadata.subject.map(item => (
                <option key={item._id} value={item.value}>{item.value}</option>
              ))}
            </select>
            {formErrors.subject && <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>}
          </div>

          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-brand-dark mb-1">
              Branch <span className="text-brand-orange ml-1">*</span>
            </label>
            <select
              id="branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-brand-light/30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all ${
                formErrors.branch ? 'border-red-500' : 'border-brand-peach/40'
              }`}
            >
              <option value="">Select branch</option>
              {metadata.branch.map(item => (
                <option key={item._id} value={item.value}>{item.value}</option>
              ))}
            </select>
            {formErrors.branch && <p className="mt-1 text-sm text-red-600">{formErrors.branch}</p>}
          </div>

          <div>
            <label htmlFor="examType" className="block text-sm font-medium text-brand-dark mb-1">
              Exam Type <span className="text-brand-orange ml-1">*</span>
            </label>
            <select
              id="examType"
              name="examType"
              value={form.examType}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-brand-light/30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all ${
                formErrors.examType ? 'border-red-500' : 'border-brand-peach/40'
              }`}
            >
              <option value="">Select exam format</option>
              {metadata.examType.map(item => (
                <option key={item._id} value={item.value}>{item.value}</option>
              ))}
            </select>
            {formErrors.examType && <p className="mt-1 text-sm text-red-600">{formErrors.examType}</p>}
          </div>

          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-brand-dark mb-1">
              Semester <span className="text-brand-orange ml-1">*</span>
            </label>
            <select
              id="semester"
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-brand-light/30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all ${
                formErrors.semester ? 'border-red-500' : 'border-brand-peach/40'
              }`}
            >
              <option value="">Select semester</option>
              {SEMESTERS.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
            {formErrors.semester && <p className="mt-1 text-sm text-red-600">{formErrors.semester}</p>}
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-brand-dark mb-1">
              Year <span className="text-brand-orange ml-1">*</span>
            </label>
            <select
              id="year"
              name="year"
              value={form.year}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-brand-light/30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all ${
                formErrors.year ? 'border-red-500' : 'border-brand-peach/40'
              }`}
            >
              <option value="">Select year</option>
              {YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {formErrors.year && <p className="mt-1 text-sm text-red-600">{formErrors.year}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-brand-dark mb-1">
            File Document <span className="text-brand-orange ml-1">*</span>
          </label>
          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors ${formErrors.file ? 'border-red-500 bg-red-50' : 'border-brand-peach/60 hover:border-brand-orange/60 bg-brand-light/20'}`}>
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-brand-maroon/40" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-brand-dark">
                <label htmlFor="file" className="relative cursor-pointer rounded-md font-medium text-brand-orange hover:text-brand-maroon focus-within:outline-none">
                  <span>Upload a file</span>
                  <input id="file" name="file" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-brand-dark/50">PDF, DOC, DOCX up to 10MB</p>
            </div>
          </div>
          {formErrors.file && <p className="mt-1 text-sm text-red-600">{formErrors.file}</p>}
          {form.file && <p className="mt-2 text-sm text-green-600 font-medium">Selected: {form.file.name}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand-maroon hover:bg-brand-dark text-white rounded-lg py-3 shadow-md focus:ring-4 focus:ring-brand-maroon/20 font-bold transition-all"
          >
            {loading ? <LoadingSpinner size="small" /> : 'Upload Resource'}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/resources')}
            disabled={loading}
            className="px-6 py-3 border border-brand-peach/50 text-brand-dark rounded-lg hover:bg-brand-light transition-colors"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
