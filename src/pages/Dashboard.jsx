import React, { useState, useEffect } from 'react';
import { FaUsers, FaMoneyBillWave, FaFileInvoiceDollar, FaChartLine, FaExclamationTriangle, FaBell } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalStudents: 0,
      feeCollected: 0,
      pendingFees: 0,
      collectionRate: 0,
      changePercent: '0%'
    },
    recentCollections: [],
    pendingPayments: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/fee-panel/dashboard/summary');
        setData(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  
  const overdueStudents = data.pendingPayments.filter(s => s.amount > 5000);
  
  const stats = [
    {
      title: 'Total Students',
      value: data.stats.totalStudents.toLocaleString(),
      icon: FaUsers,
      color: 'bg-blue-500',
      change: 'Active'
    },
    {
      title: 'Fee Collected',
      value: `₹${data.stats.feeCollected.toLocaleString()}`,
      icon: FaMoneyBillWave,
      color: 'bg-green-500',
      change: data.stats.changePercent
    },
    {
      title: 'Pending Fees',
      value: `₹${data.stats.pendingFees.toLocaleString()}`,
      icon: FaFileInvoiceDollar,
      color: 'bg-orange-500',
      change: 'To collect'
    },
    {
      title: 'Collection Rate',
      value: `${data.stats.collectionRate}%`,
      icon: FaChartLine,
      color: 'bg-purple-500',
      change: 'Overall'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back! Here's your fee management overview.
        </div>
      </div>

      {/* Alerts Section */}
      {overdueStudents.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
              <div>
                <h3 className="text-red-800 font-bold">Critical Pending Fee Alerts</h3>
                <p className="text-red-700 text-sm">{overdueStudents.length} students have high overdue balances ({'>'} ₹5,000).</p>
              </div>
            </div>
            <button className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold hover:bg-red-600 transition-colors">
              View All
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Fee Collections</h3>
          <div className="space-y-3">
            {data.recentCollections.length > 0 ? data.recentCollections.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">{item.studentName}</p>
                  <p className="text-sm text-gray-600">ID: {item.admissionNumber || 'N/A'} | Class: {item.class}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{item.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            )) : <p className="text-sm text-gray-500">No recent collections</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Payments</h3>
          <div className="space-y-3">
            {data.pendingPayments.length > 0 ? data.pendingPayments.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">{item.studentName}</p>
                  <p className="text-sm text-gray-600">ID: {item.admissionNumber} | Class: {item.class}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">₹{item.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            )) : <p className="text-sm text-gray-500">No pending payments</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;