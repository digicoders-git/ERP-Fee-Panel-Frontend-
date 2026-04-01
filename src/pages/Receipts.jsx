import React, { useState } from 'react';
import { FaDownload, FaPrint, FaEye, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import { useStudents } from '../context/StudentContext';

const Receipts = () => {
  const { students } = useStudents();
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
  // Generate receipts from students with payments
  const allReceipts = students
    .filter(student => (student.paidFee || 0) > 0)
    .map((student, index) => ({
      id: `RCP${String(index + 1).padStart(3, '0')}`,
      student: student.name,
      class: student.class,
      rollNo: student.rollNo,
      phone: student.phone,
      amount: student.paidFee || 0,
      totalFee: student.totalFee || 0,
      pendingFee: student.pendingFee || 0,
      date: new Date().toLocaleDateString('en-IN'),
      status: 'Paid'
    }));

  // Filter receipts
  const filteredReceipts = allReceipts.filter(receipt => {
    const matchesSearch = receipt.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !classFilter || receipt.class === classFilter;
    return matchesSearch && matchesClass;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReceipts = filteredReceipts.slice(startIndex, startIndex + itemsPerPage);

  // Get unique classes for filter
  const uniqueClasses = [...new Set(allReceipts.map(r => r.class))];

  const viewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
  };

  const downloadReceipt = (receipt) => {
    const receiptContent = `
FEE RECEIPT
==========

Receipt ID: ${receipt.id}
Date: ${receipt.date}

Student Details:
Name: ${receipt.student}
Class: ${receipt.class}
Roll No: ${receipt.rollNo}
Phone: ${receipt.phone}

Fee Details:
Total Fee: ₹${receipt.totalFee}
Paid Amount: ₹${receipt.amount}
Pending Amount: ₹${receipt.pendingFee}

Status: ${receipt.status}

Thank you for the payment!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${receipt.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReceipt = (receipt) => {
    const printContent = `
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 2px solid #000;">
      <h2 style="text-align: center; margin-bottom: 20px;">FEE RECEIPT</h2>
      <hr>
      <p><strong>Receipt ID:</strong> ${receipt.id}</p>
      <p><strong>Date:</strong> ${receipt.date}</p>
      <hr>
      <h3>Student Details:</h3>
      <p><strong>Name:</strong> ${receipt.student}</p>
      <p><strong>Class:</strong> ${receipt.class}</p>
      <p><strong>Roll No:</strong> ${receipt.rollNo}</p>
      <p><strong>Phone:</strong> ${receipt.phone}</p>
      <hr>
      <h3>Fee Details:</h3>
      <p><strong>Total Fee:</strong> ₹${receipt.totalFee}</p>
      <p><strong>Paid Amount:</strong> ₹${receipt.amount}</p>
      <p><strong>Pending Amount:</strong> ₹${receipt.pendingFee}</p>
      <hr>
      <p style="text-align: center;"><strong>Status: ${receipt.status}</strong></p>
      <p style="text-align: center; margin-top: 20px;">Thank you for the payment!</p>
    </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Fee Receipts</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Cards
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or receipt ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredReceipts.length)} of {filteredReceipts.length} receipts
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{receipt.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{receipt.student}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{receipt.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">₹{receipt.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{receipt.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => viewReceipt(receipt)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Receipt"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => downloadReceipt(receipt)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Download Receipt"
                      >
                        <FaDownload />
                      </button>
                      <button 
                        onClick={() => printReceipt(receipt)}
                        className="text-purple-600 hover:text-purple-900 p-1"
                        title="Print Receipt"
                      >
                        <FaPrint />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedReceipts.map((receipt) => (
            <div key={receipt.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-600">{receipt.id}</h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {receipt.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Student</p>
                  <p className="font-medium text-gray-900">{receipt.student}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="font-medium text-gray-900">{receipt.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Roll No</p>
                    <p className="font-medium text-gray-900">{receipt.rollNo}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="text-xl font-bold text-green-600">₹{receipt.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{receipt.date}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => viewReceipt(receipt)}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-1"
                >
                  <FaEye className="text-sm" />
                  <span className="text-sm">View</span>
                </button>
                <button 
                  onClick={() => downloadReceipt(receipt)}
                  className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 flex items-center justify-center space-x-1"
                >
                  <FaDownload className="text-sm" />
                  <span className="text-sm">Download</span>
                </button>
                <button 
                  onClick={() => printReceipt(receipt)}
                  className="flex-1 bg-purple-500 text-white py-2 px-3 rounded-lg hover:bg-purple-600 flex items-center justify-center space-x-1"
                >
                  <FaPrint className="text-sm" />
                  <span className="text-sm">Print</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredReceipts.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredReceipts.length)} of {filteredReceipts.length} receipts
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 border rounded-lg ${
                    currentPage === index + 1
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Receipt Details</h3>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="border-2 border-gray-300 rounded-lg p-6 space-y-4">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">FEE RECEIPT</h2>
                <p className="text-sm text-gray-600">Receipt ID: {selectedReceipt.id}</p>
                <p className="text-sm text-gray-600">Date: {selectedReceipt.date}</p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Student Details:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedReceipt.student}</p>
                  <p><span className="font-medium">Class:</span> {selectedReceipt.class}</p>
                  <p><span className="font-medium">Roll No:</span> {selectedReceipt.rollNo}</p>
                  <p><span className="font-medium">Phone:</span> {selectedReceipt.phone}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Fee Details:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Fee:</span>
                    <span className="font-medium">₹{selectedReceipt.totalFee}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Paid Amount:</span>
                    <span className="font-bold">₹{selectedReceipt.amount}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Pending Amount:</span>
                    <span className="font-medium">₹{selectedReceipt.pendingFee}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t">
                <p className="font-bold text-green-600">Status: {selectedReceipt.status}</p>
                <p className="text-sm text-gray-600 mt-2">Thank you for the payment!</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => downloadReceipt(selectedReceipt)}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2"
              >
                <FaDownload />
                <span>Download</span>
              </button>
              <button 
                onClick={() => printReceipt(selectedReceipt)}
                className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 flex items-center justify-center space-x-2"
              >
                <FaPrint />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipts;