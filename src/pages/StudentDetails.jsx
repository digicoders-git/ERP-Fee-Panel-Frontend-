import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaHome, FaMoneyBillWave } from 'react-icons/fa';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock student data - in real app, fetch based on ID
  const student = {
    id: id,
    name: 'Rahul Sharma',
    class: '10-A',
    rollNo: '001',
    phone: '9876543210',
    email: 'rahul.sharma@email.com',
    address: '123 Main Street, City, State - 123456',
    feeStatus: 'Paid',
    totalFee: 15000,
    paidFee: 15000,
    pendingFee: 0,
    feeHistory: [
      { date: '2024-01-15', amount: 5000, type: 'Tuition Fee', status: 'Paid' },
      { date: '2024-01-10', amount: 1000, type: 'Exam Fee', status: 'Paid' },
      { date: '2024-01-05', amount: 500, type: 'Library Fee', status: 'Paid' }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft />
          <span>Back to Students</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Student Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
              <p className="text-gray-600">Class: {student.class} | Roll No: {student.rollNo}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{student.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaHome className="text-blue-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{student.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <FaMoneyBillWave className="text-green-500" />
            <span>Fee Summary</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Fee:</span>
              <span className="font-semibold">₹{student.totalFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paid Fee:</span>
              <span className="font-semibold text-green-600">₹{student.paidFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Fee:</span>
              <span className="font-semibold text-red-600">₹{student.pendingFee}</span>
            </div>
            <div className="pt-2 border-t">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                student.feeStatus === 'Paid' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {student.feeStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fee History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Fee Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {student.feeHistory.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">₹{payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;