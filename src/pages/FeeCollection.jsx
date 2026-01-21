import React, { useState, useEffect } from 'react';
import { FaSearch, FaMoneyBillWave, FaReceipt, FaChevronLeft, FaChevronRight, FaUsers, FaChartBar, FaPhone, FaEnvelope, FaHome, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useStudents } from '../context/StudentContext';

const FeeCollection = () => {
  const { students, collectFee } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [feeStatusFilter, setFeeStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [upiId, setUpiId] = useState('');

  const calculateFeeStatus = (student) => {
    const pendingAmount = student.pendingFee || 0;
    return pendingAmount === 0 ? 'Paid' : pendingAmount > 5000 ? 'Overdue' : 'Pending';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm);
    
    const studentFeeStatus = calculateFeeStatus(student);
    const matchesFilter = feeStatusFilter === 'All' || studentFeeStatus === feeStatusFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, feeStatusFilter]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate fee statistics from shared context (force recalculation)
  const totalStudents = students.length;
  const totalFeeAmount = students.reduce((sum, student) => sum + (student.totalFee || 0), 0);
  const totalPaidAmount = students.reduce((sum, student) => sum + (student.paidFee || 0), 0);
  const totalPendingAmount = students.reduce((sum, student) => sum + (student.pendingFee || 0), 0);
  const studentsWithPendingFees = students.filter(student => (student.pendingFee || 0) > 0).length;

  const handleCollectFee = (student) => {
    setSelectedStudent(student);
    setPaymentAmount(student.pendingFee?.toString() || '0');
  };

  const processPayment = () => {
    const amount = parseInt(paymentAmount);
    const maxAmount = selectedStudent.pendingFee || 0;
    
    if (!paymentAmount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (amount > maxAmount) {
      toast.error(`Amount cannot exceed pending fee of ₹${maxAmount}`);
      return;
    }

    // Validate additional fields based on payment method
    if (paymentMethod === 'Online' && !transactionId.trim()) {
      toast.error('Please enter transaction ID for online transfer');
      return;
    }
    if (paymentMethod === 'Card' && !transactionId.trim()) {
      toast.error('Please enter transaction ID for card payment');
      return;
    }
    if (paymentMethod === 'Cheque' && !chequeNumber.trim()) {
      toast.error('Please enter cheque number');
      return;
    }
    if (paymentMethod === 'UPI' && !upiId.trim()) {
      toast.error('Please enter UPI transaction ID');
      return;
    }

    let additionalInfo = '';
    if (paymentMethod === 'Online') additionalInfo = `<br><strong>Transaction ID:</strong> ${transactionId}`;
    if (paymentMethod === 'Card') additionalInfo = `<br><strong>Transaction ID:</strong> ${transactionId}`;
    if (paymentMethod === 'Cheque') additionalInfo = `<br><strong>Cheque No:</strong> ${chequeNumber}`;
    if (paymentMethod === 'UPI') additionalInfo = `<br><strong>UPI ID:</strong> ${upiId}`;

    Swal.fire({
      title: 'Confirm Payment',
      html: `
        <div style="text-align: left; margin: 10px 0;">
          <strong>Student:</strong> ${selectedStudent.name}<br>
          <strong>Amount:</strong> ₹${amount}<br>
          <strong>Method:</strong> ${paymentMethod}${additionalInfo}
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, collect!'
    }).then((result) => {
      if (result.isConfirmed) {
        collectFee(selectedStudent.id, amount);
        toast.success(`Payment of ₹${amount} collected via ${paymentMethod}!`);
        setSelectedStudent(null);
        setPaymentAmount('');
        setPaymentMethod('Cash');
        setTransactionId('');
        setChequeNumber('');
        setUpiId('');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Fee Collection</h1>
        <div className="text-sm text-gray-600">
          Collect fees from students
        </div>
      </div>

      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Students</h3>
            <FaUsers className="text-blue-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
          <p className="text-sm text-gray-600">Enrolled</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Collection</h3>
            <FaMoneyBillWave className="text-green-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-green-600">₹{totalPaidAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Collected</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pending Fees</h3>
            <FaChartBar className="text-orange-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-orange-600">₹{totalPendingAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Outstanding</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pending Students</h3>
            <FaUsers className="text-red-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-red-600">{studentsWithPendingFees}</p>
          <p className="text-sm text-gray-600">Need Collection</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students for fee collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <select
              value={feeStatusFilter}
              onChange={(e) => setFeeStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Students Fee Collection</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">Roll: {student.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    ₹{student.totalFee || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ₹{student.paidFee || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                    ₹{student.pendingFee || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleCollectFee(student)}
                      disabled={(student.pendingFee || 0) === 0}
                      className={`px-4 py-2 rounded-lg cursor-pointer flex items-center space-x-2 ${
                        (student.pendingFee || 0) === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      <FaMoneyBillWave />
                      <span>{(student.pendingFee || 0) === 0 ? 'Paid' : 'Collect'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstStudent + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastStudent, filteredStudents.length)}</span> of{' '}
                  <span className="font-medium">{filteredStudents.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="h-3 w-3" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight className="h-3 w-3" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Collect Payment</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            
            {/* Student Avatar and Name */}
            <div className="text-center mb-6">
              <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">
                {selectedStudent.name?.charAt(0)}
              </div>
              <h4 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h4>
              <p className="text-sm text-gray-600">Class: {selectedStudent.class} | Roll: {selectedStudent.rollNo}</p>
            </div>

            {/* Student Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-800">{selectedStudent.phone}</p>
                </div>
              </div>

              {selectedStudent.email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-800">{selectedStudent.email}</p>
                  </div>
                </div>
              )}

              {selectedStudent.address && (
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaHome className="text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-800">{selectedStudent.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Fee Information */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-3 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <FaMoneyBillWave className="text-blue-500" />
                <h5 className="font-semibold text-gray-800">Fee Details</h5>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-600">Total Fee</p>
                  <p className="font-bold text-blue-600">₹{selectedStudent.totalFee || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Paid</p>
                  <p className="font-bold text-green-600">₹{selectedStudent.paidFee || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Due</p>
                  <p className="font-bold text-red-600">₹{selectedStudent.pendingFee || 0}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setTransactionId('');
                  setChequeNumber('');
                  setUpiId('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online Transfer</option>
                <option value="Card">Debit/Credit Card</option>
                <option value="Cheque">Cheque</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            {/* Additional fields based on payment method */}
            {paymentMethod === 'Online' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter transaction ID"
                  required
                />
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter card transaction ID"
                  required
                />
              </div>
            )}

            {paymentMethod === 'Cheque' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cheque Number
                </label>
                <input
                  type="text"
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter cheque number"
                  required
                />
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI Transaction ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter UPI transaction ID"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount (Max: ₹{selectedStudent.pendingFee || 0})
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                min="1"
                max={selectedStudent.pendingFee || 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter amount (Max: ₹${selectedStudent.pendingFee || 0})`}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={processPayment}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2"
              >
                <FaReceipt />
                <span>Collect Payment</span>
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeCollection;