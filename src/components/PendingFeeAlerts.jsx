import React, { useState } from 'react';
import { FaBell, FaCheck, FaTimes, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PendingFeeAlerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, studentId: 'STU001', name: 'Raj Kumar', class: 'Class 10', amount: 5000, daysOverdue: 15, status: 'Pending' },
    { id: 2, studentId: 'STU002', name: 'Priya Singh', class: 'Class 9', amount: 3500, daysOverdue: 8, status: 'Pending' },
    { id: 3, studentId: 'STU003', name: 'Amit Patel', class: 'Class 11', amount: 7000, daysOverdue: 25, status: 'Critical' },
    { id: 4, studentId: 'STU004', name: 'Neha Sharma', class: 'Class 8', amount: 2500, daysOverdue: 3, status: 'Warning' },
  ]);

  const [filter, setFilter] = useState('All');

  const handleMarkPaid = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast.success('Fee marked as paid');
  };

  const handleSendReminder = (id) => {
    const alert = alerts.find(a => a.id === id);
    toast.info(`Reminder sent to ${alert.name}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Warning':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Critical':
        return <FaExclamationTriangle className="text-red-600" />;
      case 'Pending':
        return <FaClock className="text-yellow-600" />;
      case 'Warning':
        return <FaBell className="text-orange-600" />;
      default:
        return <FaBell className="text-gray-600" />;
    }
  };

  const filteredAlerts = filter === 'All' 
    ? alerts 
    : alerts.filter(alert => alert.status === filter);

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.status === 'Critical').length,
    pending: alerts.filter(a => a.status === 'Pending').length,
    warning: alerts.filter(a => a.status === 'Warning').length,
    totalAmount: alerts.reduce((sum, a) => sum + a.amount, 0)
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Fee Alerts</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Alerts</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">Critical</p>
            <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm">Warning</p>
            <p className="text-2xl font-bold text-orange-600">{stats.warning}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">₹{stats.totalAmount}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', 'Critical', 'Pending', 'Warning'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${getStatusColor(alert.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-2xl mt-1">
                    {getStatusIcon(alert.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{alert.name}</h3>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {alert.studentId}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.class}</p>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Pending Amount: </span>
                        <span className="font-semibold text-gray-900">₹{alert.amount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Overdue: </span>
                        <span className="font-semibold text-gray-900">{alert.daysOverdue} days</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendReminder(alert.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                  >
                    <FaBell /> Remind
                  </button>
                  <button
                    onClick={() => handleMarkPaid(alert.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm"
                  >
                    <FaCheck /> Paid
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaCheck className="text-4xl text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">No pending fee alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingFeeAlerts;
