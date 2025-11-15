import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const StoreOwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [storeName, setStoreName] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRatings();
    fetchAverageRating();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/store/ratings');
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/store/average');
      setAverageRating(response.data.averageRating);
      setStoreName(response.data.storeName);
    } catch (error) {
      console.error('Error fetching average rating:', error);
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
          <h1 className="text-xl font-bold">Store Owner Dashboard</h1>
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
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-2">{storeName || 'Your Store'}</h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl text-yellow-500">★</span>
            <span className="text-2xl font-bold">{averageRating}</span>
            <span className="text-gray-600">Average Rating</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">User Ratings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">User Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Rating</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ratings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No ratings yet
                    </td>
                  </tr>
                ) : (
                  ratings.map((rating, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{rating.name}</td>
                      <td className="px-6 py-4">{rating.email}</td>
                      <td className="px-6 py-4">
                        <span className="text-yellow-500">{'★'.repeat(rating.rating)}</span>
                        <span className="text-gray-300">{'★'.repeat(5 - rating.rating)}</span>
                        <span className="ml-2 text-gray-600">({rating.rating}/5)</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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

export default StoreOwnerDashboard;