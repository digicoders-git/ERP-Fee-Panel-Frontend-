import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaMoneyBillWave, FaCalendar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const StudentFeeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No student data found</p>
          <button 
            onClick={() => navigate('/students')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  const calculateFeeStatus = (student) => {
    const pendingAmount = student.pendingFee || 0;
    return pendingAmount === 0 ? 'Paid' : pendingAmount > 5000 ? 'Overdue' : 'Pending';
  };

  const feeStatus = calculateFeeStatus(student);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Student Fee Details</h1>
        <button 
          onClick={() => navigate('/students')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl">
            {student.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-gray-600">{student.class} - Roll No: {student.rollNo}</p>
            <p className="text-gray-600">{student.phone}</p>
          </div>
        </div>

        {/* Fee Status Badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${
            feeStatus === 'Paid' ? 'bg-green-100 text-green-800' :
            feeStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {feeStatus === 'Paid' ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
            {feeStatus}
          </span>
        </div>

        {/* Fee Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <FaMoneyBillWave className="text-blue-500 text-3xl mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Fee</h3>
            <p className="text-3xl font-bold text-blue-600">₹{student.totalFee || 0}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6 text-center">
            <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Paid Amount</h3>
            <p className="text-3xl font-bold text-green-600">₹{student.paidFee || 0}</p>
          </div>

          <div className="bg-red-50 rounded-lg p-6 text-center">
            <FaExclamationCircle className="text-red-500 text-3xl mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Amount</h3>
            <p className="text-3xl font-bold text-red-600">₹{student.pendingFee || 0}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8">
          {(student.pendingFee || 0) > 0 && (
            <button 
              onClick={() => navigate('/fee-collection')}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold"
            >
              Collect Fee
            </button>
          )}
        </div>
      </div>

      {/* Fee History Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {student.paidFee > 0 ? (
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">15/12/2024</td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">₹{student.paidFee}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Cash</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No payment history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeDetails;