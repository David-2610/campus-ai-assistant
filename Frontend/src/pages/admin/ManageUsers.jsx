import { useState, useEffect } from 'react';
import api from '../../api/api';
import Button from '../../components/ui/Button';
import { BRANCHES } from '../../utils/constants';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    graduationYear: '',
    role: '',
    branch: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.graduationYear) queryParams.append('graduationYear', filters.graduationYear);
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.branch) queryParams.append('branch', filters.branch);

      const { data } = await api.get(`/admin/users?${queryParams.toString()}`);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleStatusToggle = async (userId, newStatus) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive: newStatus });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">User Management</h1>
          <p className="text-brand-maroon/70 mt-1">Manage accounts, batch assignments, and permissions</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-brand-peach/30 mb-6 flex gap-4">
        <select
          name="graduationYear"
          value={filters.graduationYear}
          onChange={handleFilterChange}
          className="border border-brand-peach/40 rounded-lg px-4 py-2 bg-brand-light/30 focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
        >
          <option value="">All Batches</option>
          {[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032].map(year => (
            <option key={year} value={year}>Batch {year}</option>
          ))}
        </select>

        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="border border-brand-peach/40 rounded-lg px-4 py-2 bg-brand-light/30 focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        
        <select
          name="branch"
          value={filters.branch}
          onChange={handleFilterChange}
          className="border border-brand-peach/40 rounded-lg px-4 py-2 bg-brand-light/30 focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
        >
          <option value="">All Branches</option>
          {BRANCHES.map(branch => (
            <option key={branch.value} value={branch.value}>{branch.label}</option>
          ))}
        </select>
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
        <div className="bg-white rounded-xl shadow-sm border border-brand-peach/30 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-light/40 border-b border-brand-peach/40">
                <th className="p-4 font-semibold text-brand-dark">Name</th>
                <th className="p-4 font-semibold text-brand-dark">Email</th>
                <th className="p-4 font-semibold text-brand-dark">Branch</th>
                <th className="p-4 font-semibold text-brand-dark">Batch</th>
                <th className="p-4 font-semibold text-brand-dark">Role</th>
                <th className="p-4 font-semibold text-brand-dark">Status</th>
                <th className="p-4 font-semibold text-brand-dark text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-brand-light hover:bg-brand-light/20 transition-colors">
                  <td className="p-4 font-medium text-brand-dark">{user.name}</td>
                  <td className="p-4 text-brand-dark/70">{user.email}</td>
                  <td className="p-4 text-brand-dark/70">{user.branch || '-'}</td>
                  <td className="p-4">
                    {user.graduationYear ? (
                      <span className="bg-brand-peach/20 text-brand-maroon px-2 py-1 rounded text-sm font-semibold">
                        {user.graduationYear}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`text-sm px-2 py-1 rounded border focus:outline-none ${user.role === 'admin' ? 'bg-brand-maroon/10 border-brand-maroon/30 text-brand-maroon font-bold' : 'bg-brand-light border-brand-peach/40 text-brand-dark'}`}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? 'Active' : 'Banned'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant={user.isActive ? "secondary" : "primary"}
                      onClick={() => handleStatusToggle(user._id, !user.isActive)}
                      className={`text-sm py-1 px-3 ${user.isActive ? 'hover:bg-red-50 hover:text-red-600 border-red-200' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                      {user.isActive ? 'Suspend' : 'Unban'}
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-brand-dark/50 italic">
                    No users found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
