import React from 'react';
import { FaTimes, FaUser, FaPhone, FaEnvelope, FaHome, FaGraduationCap, FaIdCard, FaMoneyBillWave } from 'react-icons/fa';

const ViewStudentModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  // Calculate fee status based on pending amount
  const pendingAmount = student.pendingFee || 0;
  const feeStatus = pendingAmount === 0 ? 'Paid' : pendingAmount > 5000 ? 'Overdue' : 'Pending';

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 border w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Student Details</h3>
          <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          {/* Student Avatar and Name */}
          <div className="text-center mb-6">
            <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">
              {student.name?.charAt(0)}
            </div>
            <h4 className="text-xl font-bold text-gray-800">{student.name}</h4>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${
              feeStatus === 'Paid' ? 'bg-green-100 text-green-800' :
              feeStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {feeStatus}
            </span>
          </div>

          {/* Student Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaGraduationCap className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="font-medium text-gray-800">{student.class}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaIdCard className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="font-medium text-gray-800">{student.rollNo}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaPhone className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-800">{student.phone}</p>
              </div>
            </div>

            {student.email && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">{student.email}</p>
                </div>
              </div>
            )}

            {student.address && (
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaHome className="text-blue-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-800">{student.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Fee Information */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <FaMoneyBillWave className="text-blue-500" />
              <h5 className="font-semibold text-gray-800">Fee Details</h5>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600">Total Fee</p>
                <p className="font-bold text-blue-600">₹{student.totalFee || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Paid</p>
                <p className="font-bold text-green-600">₹{student.paidFee || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Due</p>
                <p className="font-bold text-red-600">₹{student.pendingFee || 0}</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full bg-blue-500 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentModal;