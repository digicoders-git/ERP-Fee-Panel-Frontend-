import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaGift } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ScholarshipDiscount = () => {
  const [records, setRecords] = useState([
    { id: 1, studentId: 'STU001', name: 'Raj Kumar', type: 'Scholarship', amount: 5000, percentage: 0, reason: 'Merit based' },
    { id: 2, studentId: 'STU002', name: 'Priya Singh', type: 'Discount', amount: 0, percentage: 10, reason: 'Sibling discount' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    type: 'Scholarship',
    amount: '',
    percentage: '',
    reason: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.name) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.type === 'Scholarship' && !formData.amount) {
      toast.error('Please enter scholarship amount');
      return;
    }

    if (formData.type === 'Discount' && !formData.percentage) {
      toast.error('Please enter discount percentage');
      return;
    }

    if (editingId) {
      setRecords(prev => prev.map(record => 
        record.id === editingId 
          ? {
              ...record,
              ...formData,
              amount: parseFloat(formData.amount) || 0,
              percentage: parseFloat(formData.percentage) || 0
            }
          : record
      ));
      toast.success('Record updated successfully');
      setEditingId(null);
    } else {
      const newRecord = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        percentage: parseFloat(formData.percentage) || 0
      };
      setRecords(prev => [...prev, newRecord]);
      toast.success('Record added successfully');
    }
    
    setFormData({ studentId: '', name: '', type: 'Scholarship', amount: '', percentage: '', reason: '' });
    setShowForm(false);
  };

  const handleEdit = (record) => {
    setFormData({
      studentId: record.studentId,
      name: record.name,
      type: record.type,
      amount: record.amount,
      percentage: record.percentage,
      reason: record.reason
    });
    setEditingId(record.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setRecords(prev => prev.filter(record => record.id !== id));
    toast.success('Record deleted successfully');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ studentId: '', name: '', type: 'Scholarship', amount: '', percentage: '', reason: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Scholarships & Discounts</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Record
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Record' : 'Add New Record'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="e.g., STU001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Student name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Scholarship">Scholarship</option>
                  <option value="Discount">Discount</option>
                </select>
              </div>
              {formData.type === 'Scholarship' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount % *</label>
                  <input
                    type="number"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Reason for scholarship/discount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <FaTimes /> Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <FaCheck /> {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount/Discount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-700">{record.studentId}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{record.name}</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    record.type === 'Scholarship'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {record.type}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                  {record.type === 'Scholarship' ? `₹${record.amount}` : `${record.percentage}%`}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">{record.reason}</td>
                <td className="px-6 py-3 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScholarshipDiscount;
