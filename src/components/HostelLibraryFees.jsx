import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const HostelLibraryFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Hostel',
    category: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/fee-panel/extras/hostel-library');
      if (response.data?.success) {
        setFees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
      toast.error('Failed to load fee records');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        const response = await api.put(`/api/fee-panel/extras/hostel-library/${editingId}`, {
          ...formData,
          amount: parseFloat(formData.amount)
        });
        if (response.data?.success) {
          toast.success('Fee updated successfully');
          fetchFees();
          setEditingId(null);
        }
      } else {
        const response = await api.post('/api/fee-panel/extras/hostel-library', {
          ...formData,
          amount: parseFloat(formData.amount)
        });
        if (response.data?.success) {
          toast.success('Fee added successfully');
          fetchFees();
        }
      }
      setFormData({ type: 'Hostel', category: '', amount: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving fee:', error);
      toast.error(error.response?.data?.message || 'Failed to save fee record');
    }
  };

  const handleEdit = (fee) => {
    setFormData({
      type: fee.type,
      category: fee.category,
      amount: fee.amount,
      description: fee.description
    });
    setEditingId(fee._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee?')) return;
    try {
      const response = await api.delete(`/api/fee-panel/extras/hostel-library/${id}`);
      if (response.data?.success) {
        toast.success('Fee deleted successfully');
        fetchFees();
      }
    } catch (error) {
      console.error('Error deleting fee:', error);
      toast.error('Failed to delete fee record');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ type: 'Hostel', category: '', amount: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Hostel & Library Fees</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Fee
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Fee' : 'Add New Fee'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Hostel">Hostel</option>
                  <option value="Library">Library</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Boys, Girls, General"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Fee description"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Hostel', 'Library'].map(type => (
          <div key={type} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{type} Fees</h3>
            <div className="space-y-3">
              {fees.filter(f => f.type === type).map(fee => (
                <div key={fee._id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{fee.category}</p>
                    <p className="text-sm text-gray-600">{fee.description}</p>
                    <p className="text-lg font-semibold text-blue-600 mt-1">₹{fee.amount}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(fee)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(fee._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostelLibraryFees;
