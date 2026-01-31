import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaChartBar,
  FaCog,
  FaKey,
  FaSignOutAlt,
  FaUserGraduate,
  FaReceipt,
  FaUser
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/students', icon: FaUserGraduate, label: 'Students' },
    { path: '/fee-collection', icon: FaMoneyBillWave, label: 'Fee Collection' },
    { path: '/fee-structure', icon: FaFileInvoiceDollar, label: 'Fee Structure' },
    { path: '/receipts', icon: FaReceipt, label: 'Receipts' },
    { path: '/reports', icon: FaChartBar, label: 'Reports' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        toast.success('Signed out successfully');
        navigate('/login');
      }
    });
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <div className={`bg-[#0f172a] text-slate-300 h-screen flex flex-col shadow-2xl transition-all duration-300 ease-in-out border-r border-slate-800 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Brand Header */}
      <div className={`h-20 flex items-center ${isOpen ? 'px-6' : 'justify-center px-0'} border-b border-slate-800/50 bg-[#1e293b]/30`}>
        {isOpen ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
              <FaMoneyBillWave className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg tracking-tight leading-tight">FeePanel</span>
              <span className="text-blue-400 text-[10px] uppercase font-bold tracking-widest leading-none">Management</span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <FaMoneyBillWave className="text-xl" />
          </div>
        )}
      </div>

      {/* Navigation Items - Scrollable area */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center ${isOpen ? 'px-4' : 'justify-center'} py-3.5 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-600'
                    : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
                  }`
                }
                title={!isOpen ? item.label : ''}
              >
                <item.icon className={`text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isOpen ? 'mr-4' : ''}`} />
                {isOpen && <span className="font-semibold tracking-wide text-[15px]">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile & Bottom Actions */}
      <div className="mt-auto p-4 border-t border-slate-800 bg-[#1e293b]/20">
        <div className="space-y-1.5">
          <button
            onClick={handleChangePassword}
            className={`flex items-center w-full cursor-pointer ${isOpen ? 'px-4' : 'justify-center px-0'} py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200 group`}
            title={!isOpen ? 'Change Password' : ''}
          >
            <FaKey className={`text-lg flex-shrink-0 transition-transform duration-200 group-hover:rotate-12 ${isOpen ? 'mr-4' : ''}`} />
            {isOpen && <span className="font-medium text-[14px]">Security</span>}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center w-full cursor-pointer ${isOpen ? 'px-4' : 'justify-center px-0'} py-3 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all duration-200 group`}
            title={!isOpen ? 'Logout' : ''}
          >
            <FaSignOutAlt className={`text-lg flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${isOpen ? 'mr-4' : ''}`} />
            {isOpen && <span className="font-medium text-[14px]">Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;