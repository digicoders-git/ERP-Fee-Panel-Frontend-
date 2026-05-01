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
  };  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (num) => {
        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        let str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
        return str;
    }
    return inWords(num);
  };
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const printReceipt = async (receipt) => {
    try {
      const response = await api.get(`/api/fee-panel/payment/receipt/${receipt._id}`);
      if (response.data && response.data.data) {
        const r = response.data.data;
        const amountInWords = numberToWords(r.payment.amount);
        const logoUrl = getImageUrl(r.branch?.logo);
        const printContent = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&display=swap');
          
          :root {
            --primary: #1e293b;
            --accent: #4f46e5;
            --success: #10b981;
            --text-main: #334155;
            --text-light: #64748b;
          }

          body { 
            font-family: 'Outfit', sans-serif; 
            color: var(--text-main); 
            margin: 0; 
            padding: 40px; 
            background: #fff; 
            -webkit-print-color-adjust: exact;
            display: flex;
            justify-content: center;
          }

          .receipt-main {
            width: 800px;
            padding: 40px;
            background: #fff;
            position: relative;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
          }

          /* Watermark */
          .watermark-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 70px;
            font-weight: 900;
            color: rgba(79, 70, 229, 0.04);
            white-space: nowrap;
            pointer-events: none;
            z-index: 0;
            text-transform: uppercase;
            letter-spacing: 12px;
          }

          .watermark-img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            opacity: 0.05;
            z-index: 0;
            pointer-events: none;
          }

          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border-bottom: 2px solid #f1f5f9; 
            padding-bottom: 25px; 
            margin-bottom: 35px; 
            position: relative;
            z-index: 1;
          }

          .logo-area {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .logo-box {
            width: 60px;
            height: 60px;
            background: var(--accent);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .logo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .logo-box span {
            color: white;
            font-weight: 900;
            font-size: 24px;
          }

          .inst-info h1 { 
            font-size: 24px; 
            font-weight: 800; 
            margin: 0; 
            color: var(--primary); 
            letter-spacing: -0.5px;
            text-transform: uppercase;
          }

          .inst-info p { 
            font-size: 12px; 
            color: var(--text-light); 
            margin: 4px 0 0 0; 
            max-width: 300px; 
            line-height: 1.4;
          }

          .receipt-meta {
            text-align: right;
          }

          .receipt-meta h2 { 
            font-size: 12px; 
            font-weight: 900; 
            color: var(--accent); 
            margin: 0; 
            text-transform: uppercase; 
            letter-spacing: 2px;
          }

          .receipt-no { 
            font-size: 26px; 
            font-weight: 800; 
            margin: 5px 0 0 0; 
            color: var(--primary); 
          }

          .details-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 30px;
            margin-bottom: 35px;
            position: relative;
            z-index: 1;
          }

          .info-box h3 {
            font-size: 10px;
            font-weight: 800;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
          }

          .info-box p {
            font-size: 15px;
            font-weight: 700;
            margin: 0;
            color: var(--primary);
          }

          .sub-text {
            font-size: 11px;
            color: var(--text-light);
            margin-top: 3px;
          }

          .table-section {
            position: relative;
            z-index: 1;
            margin-bottom: 30px;
          }

          .fee-table { 
            width: 100%; 
            border-collapse: separate; 
            border-spacing: 0;
          }

          .fee-table th { 
            text-align: left; 
            background: #f8fafc; 
            padding: 16px; 
            font-size: 11px; 
            font-weight: 800; 
            color: var(--text-light); 
            text-transform: uppercase; 
            border-top: 1.5px solid var(--primary);
            border-bottom: 1px solid #e2e8f0;
          }

          .fee-table td { 
            padding: 18px 16px; 
            border-bottom: 1px solid #f1f5f9; 
            font-size: 15px; 
            color: var(--text-main); 
          }

          .val { 
            text-align: right; 
            font-weight: 700; 
          }

          .summary-wrap {
            display: flex;
            justify-content: flex-end;
            position: relative;
            z-index: 1;
          }

          .summary-card {
            width: 300px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 18px;
          }

          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 13px;
          }

          .total-item {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px dashed #cbd5e1;
            font-size: 18px;
            font-weight: 800;
            color: var(--accent);
          }

          .paid-stamp {
            position: absolute;
            top: 180px;
            right: 60px;
            border: 5px solid var(--success);
            color: var(--success);
            padding: 12px 25px;
            border-radius: 15px;
            font-weight: 900;
            font-size: 32px;
            text-transform: uppercase;
            transform: rotate(15deg);
            opacity: 0.15;
            z-index: 0;
          }

          .footer-wrap { 
            margin-top: 50px; 
            padding-top: 25px; 
            border-top: 1px solid #f1f5f9; 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-end; 
            position: relative;
            z-index: 1;
          }

          .note { 
            font-size: 10px; 
            color: var(--text-light); 
            line-height: 1.6;
            max-width: 450px;
          }

          .signature-wrap {
            text-align: center;
          }

          .line {
            width: 170px;
            border-top: 2px solid var(--primary);
            margin-bottom: 10px;
          }

          .signature-wrap p {
            font-size: 11px;
            font-weight: 800;
            color: var(--text-light);
            text-transform: uppercase;
          }

          @media print {
            body { padding: 0; }
            .receipt-main { box-shadow: none; border: none; padding: 10px; width: 100%; }
            .paid-stamp { opacity: 0.2; }
          }
        </style>

        <div class="receipt-main">
          ${logoUrl ? `<img src="${logoUrl}" class="watermark-img" />` : `<div class="watermark-text">${r.branch?.name || 'SCHOOL'}</div>`}
          
          ${r.payment.status === 'paid' || r.balance === 0 ? '<div class="paid-stamp">PAID</div>' : ''}

          <div class="header">
            <div class="logo-area">
              <div class="logo-box">
                ${logoUrl ? `<img src="${logoUrl}" alt="logo" />` : `<span>${(r.branch?.name || 'S').charAt(0)}</span>`}
              </div>
              <div class="inst-info">
                <h1>${r.branch?.name || 'School Name'}</h1>
                <p>${r.branch?.address || 'N/A'}</p>
                <p style="margin-top: 2px;">Ph: ${r.branch?.phone || ''} | Email: ${r.branch?.email || ''}</p>
              </div>
            </div>
            <div class="receipt-meta">
              <h2>Fee Receipt</h2>
              <p class="receipt-no">#${r.receiptNumber.toUpperCase()}</p>
              <div style="font-size: 11px; color: var(--text-light); font-weight: 800; margin-top: 4px;">
                DATE: ${new Date(r.date).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
          
          <div class="details-grid">
            <div class="info-box">
              <h3>Student Details</h3>
              <p>${r.student.name}</p>
              <div class="sub-text">
                ADM NO: ${r.student.admissionNumber || 'N/A'} | CLASS: ${r.student.class?.className || r.student.class} | ROLL: ${r.student.rollNumber || 'N/A'}
              </div>
            </div>
            <div class="info-box" style="text-align: right;">
              <h3>Payment Status</h3>
              <p>${r.payment.paymentMode.toUpperCase()}</p>
              <div class="sub-text">
                TXN ID: ${r.payment.transactionId || 'CASH_DIRECT'}
              </div>
            </div>
          </div>
          
          <div class="table-section">
            <table class="fee-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Paid Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight: 600;">${r.payment.feeType} Fee Payment</td>
                  <td class="val" style="color: var(--accent); font-size: 18px;">₹${r.payment.amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colspan="2" style="font-size: 11px; color: var(--text-light); font-style: italic; border-bottom: none; padding-top: 10px;">
                    Amount in words: ${amountInWords}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="summary-wrap">
            <div class="summary-card">
              <div class="item">
                <span>Received Amount</span>
                <span style="font-weight: 700;">₹${r.payment.amount.toLocaleString()}</span>
              </div>
              <div class="item">
                <span>Pending Balance</span>
                <span style="color: #ef4444; font-weight: 700;">₹${r.balance.toLocaleString()}</span>
              </div>
              <div class="item total-item">
                <span>Total Received</span>
                <span>₹${r.payment.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="footer-wrap">
            <div class="note">
              <p>• This is a computer-generated receipt and does not require a physical signature.</p>
              <p>• Please keep this receipt safe for future reference regarding fee adjustments.</p>
            </div>
            <div class="signature-wrap">
              <div class="line"></div>
              <p>Accountant Signature</p>
            </div>
          </div>
        </div>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Receipt ${r.receiptNumber}</title></head><body>${printContent}</body></html>`);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
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