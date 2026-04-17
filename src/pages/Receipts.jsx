import React, { useState, useEffect } from 'react';
import { FaDownload, FaPrint, FaEye, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Receipts = () => {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [receiptsData, setReceiptsData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [historyRes, classesRes] = await Promise.all([
        api.get('/api/fee-panel/payment/history?limit=1000'),
        api.get('/api/class/all?limit=100')
      ]);

      const paymentsData = historyRes.data.data?.payments || historyRes.data.payments;

      if (paymentsData) {
        const mapped = paymentsData.map((p, idx) => ({
           _id: p._id,
           id: p.transactionId || `RCP${String(idx + 1).padStart(3, '0')}`,
           student: p.studentName,
           admissionNumber: p.admissionNumber || 'N/A',
           class: p.class,
           rollNo: p.rollNumber || 'N/A',
           phone: p.studentMobile || 'N/A', 
           amount: p.amount,
           totalFee: p.totalFee || p.amount,
           pendingFee: p.pendingFee || 0,
           date: p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN') : 'N/A',
           paymentMode: p.paymentMode || 'N/A',
           status: p.status === 'paid' ? 'Paid' : 'Partial'
        }));
        setReceiptsData(mapped);
      }

      if (classesRes.data && classesRes.data.classes) {
        setClasses(classesRes.data.classes);
      }
      toast.success('Data loaded successfully');
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter receipts
  const filteredReceipts = receiptsData.filter(receipt => {
    const matchesSearch = receipt.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          receipt.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !classFilter || receipt.class === classFilter;
    return matchesSearch && matchesClass;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReceipts = filteredReceipts.slice(startIndex, startIndex + itemsPerPage);


  const viewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
  };

  const downloadReceipt = async (receipt) => {
    try {
      toast.info('Generating receipt...');
      const response = await api.get(`/api/fee-panel/payment/receipt/${receipt._id}`);
      if (response.data && response.data.data) {
        const r = response.data.data;
        const receiptContent = `
========================================
       ${(r.branch?.name || 'School Name').toUpperCase()}
========================================
OFFICIAL FEE RECEIPT
Receipt No: ${r.receiptNumber}
Date: ${new Date(r.date).toLocaleDateString('en-IN')}
----------------------------------------
STUDENT DETAILS:
Name: ${r.student.name}
Roll No: ${r.student.rollNumber}
Class: ${r.student.class?.className || r.student.class}
----------------------------------------
PAYMENT DETAILS:
Fee Type: ${r.payment.feeType}
Amount Paid: ₹${r.payment.amount}
Payment Mode: ${r.payment.paymentMode}
Transaction ID: ${r.payment.transactionId}
----------------------------------------
Outstanding Balance: ₹${r.balance}
----------------------------------------
Thank you for your payment!
========================================
        `;
        
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Receipt_${r.receiptNumber}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Receipt downloaded');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to generate receipt');
    }
  };

  const printReceipt = async (receipt) => {
    try {
      const response = await api.get(`/api/fee-panel/payment/receipt/${receipt._id}`);
      if (response.data && response.data.data) {
        const r = response.data.data;
        const printContent = `
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none; }
            .receipt-container { border: 1px solid #000 !important; box-shadow: none !important; }
          }
          .receipt-container {
            font-family: 'Segoe UI', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            border: 2px solid #1e3a8a;
            border-radius: 8px;
            color: #1e293b;
            background: #fff;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .school-name {
            font-size: 32px;
            font-weight: 800;
            color: #1e3a8a;
            margin: 0;
            letter-spacing: 1px;
          }
          .school-info {
            font-size: 14px;
            color: #64748b;
            margin: 5px 0;
            font-weight: 500;
          }
          .receipt-title {
            display: inline-block;
            background: #1e3a8a;
            color: #fff;
            padding: 5px 25px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: 600;
            margin-top: 15px;
            text-transform: uppercase;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
          }
          .info-item { margin-bottom: 10px; font-size: 14px; }
          .info-label { color: #64748b; font-weight: 600; font-size: 12px; text-transform: uppercase; display: block; }
          .info-value { color: #1e293b; font-weight: 700; font-size: 15px; }
          
          .fee-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          .fee-table th {
            background: #1e3a8a;
            color: #fff;
            text-align: left;
            padding: 12px 15px;
            font-size: 14px;
            text-transform: uppercase;
          }
          .fee-table td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 15px;
          }
          .amount-row {
            background: #f1f5f9;
            font-weight: 800;
          }
          .total-amount {
            color: #059669;
            font-size: 20px;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 80px;
            padding: 0 40px;
          }
          .sig-box {
            text-align: center;
            width: 200px;
            border-top: 1px solid #1e293b;
            padding-top: 10px;
            font-size: 14px;
            font-weight: 600;
            color: #475569;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(0,0,0,0.03);
            pointer-events: none;
            z-index: 0;
            white-space: nowrap;
          }
        </style>

        <div class="receipt-container" style="position: relative; overflow: hidden;">
          <div class="watermark">PAID OFFICIAL</div>
          
          <div class="header">
            <h1 class="school-name">${(r.branch?.name || 'School Name').toUpperCase()}</h1>
            <p class="school-info">${r.branch?.address || 'School Location Address'}</p>
            <p class="school-info">Phone: ${r.branch?.phone || 'N/A'} | Email: ${r.branch?.email || 'N/A'}</p>
            <div class="receipt-title">Official Fee Receipt</div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: 700; font-size: 14px;">
            <div style="color: #1e3a8a;">RECEIPT NO: ${r.receiptNumber}</div>
            <div>DATE: ${new Date(r.date).toLocaleDateString('en-IN')}</div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Student Name</span>
              <span class="info-value">${r.student.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Father's Name</span>
              <span class="info-value">${r.student.parentName || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Admission No</span>
              <span class="info-value">${r.student.admissionNumber}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Class & Section</span>
              <span class="info-value">${r.student.class} - ${r.student.section || 'A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Roll Number</span>
              <span class="info-value">${r.student.rollNumber}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Payment Mode</span>
              <span class="info-value" style="text-transform: capitalize;">${r.payment.paymentMode}</span>
            </div>
          </div>

          <table class="fee-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 600;">${r.payment.feeType}</td>
                <td style="text-align: right; font-weight: 700;">₹${r.payment.amount.toLocaleString()}</td>
              </tr>
              <tr class="amount-row">
                <td style="text-align: right; border: none;">TOTAL PAID:</td>
                <td style="text-align: right; border: none;" class="total-amount">₹${r.payment.amount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-bottom: 30px; padding: 15px; border-left: 4px solid #059669; background: #ecfdf5; font-size: 14px;">
            <strong>Outstanding Balance:</strong> ₹${r.balance.toLocaleString()}
          </div>

          <div class="signatures">
            <div class="sig-box">Accountant's Signature</div>
            <div class="sig-box">Principal's Signature</div>
          </div>

          <div style="text-align: center; margin-top: 50px; font-size: 11px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
            This is an electronically generated document. No signature is required for validity. 
            <br>Generated on ${new Date().toLocaleString('en-IN')}
          </div>
        </div>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Receipt ${r.receiptNumber}</title></head><body style="padding: 20px; background: #f1f5f9;">${printContent}</body></html>`);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to generate print view');
    }
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
              {classes.map(cls => (
                <option key={cls._id} value={cls.className}>{cls.className}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fetchData()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <span>Fetch Data</span>
            </button>
            <div className="flex items-center justify-between flex-1">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{receipt.paymentMode || 'N/A'}</td>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mode</p>
                    <p className="font-medium text-gray-900 capitalize">{receipt.paymentMode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{receipt.date}</p>
                  </div>
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