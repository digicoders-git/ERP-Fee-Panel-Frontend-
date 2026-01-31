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
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 h-20 flex items-center shrink-0">
      <div className="w-full px-6 flex items-center justify-between">
        {/* Left side - Menu toggle */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl cursor-pointer text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
          >
            <FaBars className={`text-xl transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Right side - Stats & User */}
        <div className="flex items-center space-x-6">
          {/* DateTime Display */}
          <div className="hidden md:flex items-center space-x-4 border-r border-gray-100 pr-6">
            <div className="flex flex-col items-end">
              <span className="text-gray-900 font-bold text-sm tracking-tight">{formatTime(currentTime)}</span>
              <span className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">{formatDate(currentTime)}</span>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
              <FaCalendarAlt className="text-lg" />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-2">
            <div className="flex flex-col items-end text-right">
              <span className="text-gray-900 font-bold text-sm leading-tight">{user?.name || 'Administrator'}</span>
              <span className="text-blue-500 text-[11px] font-bold uppercase tracking-wider">{user?.role || 'Fee Manager'}</span>
            </div>
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;