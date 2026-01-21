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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/students', icon: FaUserGraduate, label: 'Students' },
    { path: '/fee-collection', icon: FaMoneyBillWave, label: 'Fee Collection' },
    { path: '/fee-structure', icon: FaFileInvoiceDollar, label: 'Fee Structure' },
    { path: '/receipts', icon: FaReceipt, label: 'Receipts' },
    { path: '/reports', icon: FaChartBar, label: 'Reports' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
    // { path: '/settings', icon: FaCog, label: 'Settings' }
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the system',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        toast.success('Logged out successfully!');
        navigate('/login');
      }
    });
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <div className={`bg-gray-800 text-white min-h-screen flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      {/* Menu Items */}
      <nav className="flex-1 px-2 py-6">
        <ul className="space-y-5">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center ${isOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3 rounded-lg transition-colors duration-200 ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
                title={!isOpen ? item.label : ''}
              >
                <item.icon className="text-lg flex-shrink-0" />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="px-2 py-4 border-t border-gray-700">
        <div className="space-y-2">
          <button
            onClick={handleChangePassword}
            className={`flex items-center cursor-pointer ${isOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3 w-full text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200`}
            title={!isOpen ? 'Change Password' : ''}
          >
            <FaKey className="text-lg flex-shrink-0" />
            {isOpen && <span className="font-medium">Change Password</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className={`flex items-center ${isOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3 w-full text-gray-300 cursor-pointer hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200`}
            title={!isOpen ? 'Logout' : ''}
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;