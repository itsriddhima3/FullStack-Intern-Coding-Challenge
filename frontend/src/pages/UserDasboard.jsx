import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, [filters, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      const params = { ...filters, sortBy, sortOrder };
      const response = await axios.get('http://localhost:5000/api/user/stores', { params });
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      await axios.post('http://localhost:5000/api/user/rate', { storeId, rating });
      fetchStores();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">User Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span>{user?.name}</span>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-yellow-500 px-4 py-1 rounded hover:bg-yellow-600"
            >
              Change Password
            </button>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Stores</h2>
        
        <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-2 gap-4">
          <input
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="px-3 py-2 border rounded"
          />
          <input
            placeholder="Search by address"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            className="px-3 py-2 border rounded"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('name')}>
                  Store Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('address')}>
                  Address {sortBy === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('overallRating')}>
                  Overall Rating {sortBy === 'overallRating' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left">Your Rating</th>
                <th className="px-6 py-3 text-left">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{store.name}</td>
                  <td className="px-6 py-4">{store.address}</td>
                  <td className="px-6 py-4">
                    <span className="text-yellow-600">★ {parseFloat(store.overallRating).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {store.userRating ? (
                      <span className="text-blue-600">★ {store.userRating}</span>
                    ) : (
                      <span className="text-gray-400">Not rated</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRating(store.id, rating)}
                          className={`text-xl ${
                            store.userRating >= rating ? 'text-yellow-500' : 'text-gray-300'
                          } hover:text-yellow-500`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

const PasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.put('http://localhost:5000/api/auth/change-password', formData);
      setMessage('Password changed successfully');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>
        {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={formData.oldPassword}
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <p className="text-xs text-gray-500 mt-1">6-12 chars, 1 uppercase, 1 special char</p>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Change Password
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;