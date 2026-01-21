import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaClock, FaCalendarAlt, FaBars } from 'react-icons/fa';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Menu toggle and Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <FaBars className="text-xl" />
            </button>
            
          </div>

          {/* Right side - Admin info and DateTime */}
          <div className="flex items-center space-x-6">
            {/* Live Date Time */}
            <div className="flex items-center flex-col space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <FaClock className="text-blue-500" />
                <span className="font-medium">{formatTime(currentTime)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaCalendarAlt className="text-blue-500" />
                <span className="font-medium">{formatDate(currentTime)}</span>
              </div>
            </div>

            {/* Admin Role */}
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{user?.role || 'Admin'}</p>
                <p className="text-gray-600">{user?.name || 'Admin User'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;