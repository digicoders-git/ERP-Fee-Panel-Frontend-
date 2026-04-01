import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (passwords.currentPassword !== 'password123') {
      toast.error('Current password is incorrect!');
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long!');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    toast.success('Password changed successfully!');
    navigate('/dashboard');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaKey className="text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
          <p className="text-gray-600">Update your account password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPasswords.current ? 'text' : 'password'}
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPasswords.new ? 'text' : 'password'}
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
            >
              Change Password
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition duration-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
 
      </div>
    </div>
  );
};

export default ChangePassword;