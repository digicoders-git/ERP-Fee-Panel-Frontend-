import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaCreditCard, FaUniversity } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PaymentOptions = () => {
  const [payments, setPayments] = useState([
    { id: 1, method: 'Online', gateway: 'Razorpay', status: 'Active', charges: 2.5 },
    { id: 2, method: 'Online', gateway: 'PayPal', status: 'Active', charges: 3.5 },
    { id: 3, method: 'Offline', gateway: 'Bank Transfer', status: 'Active', charges: 0 },
    { id: 4, method: 'Offline', gateway: 'Cheque', status: 'Active', charges: 0 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    method: 'Online',
    gateway: '',
    status: 'Active',
    charges: ''
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
    
    if (!formData.gateway) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingId) {
      setPayments(prev => prev.map(payment => 
        payment.id === editingId 
          ? { ...payment, ...formData, charges: parseFloat(formData.charges) || 0 }
          : payment
      ));
      toast.success('Payment option updated');
      setEditingId(null);
    } else {
      const newPayment = {
        id: Date.now(),
        ...formData,
        charges: parseFloat(formData.charges) || 0
      };
      setPayments(prev => [...prev, newPayment]);
      toast.success('Payment option added');
    }
    
    setFormData({ method: 'Online', gateway: '', status: 'Active', charges: '' });
    setShowForm(false);
  };

  const handleEdit = (payment) => {
    setFormData({
      method: payment.method,
      gateway: payment.gateway,
      status: payment.status,
      charges: payment.charges
    });
    setEditingId(payment.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setPayments(prev => prev.filter(payment => payment.id !== id));
    toast.success('Payment option deleted');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ method: 'Online', gateway: '', status: 'Active', charges: '' });
  };

  const toggleStatus = (id) => {
    setPayments(prev => prev.map(payment =>
      payment.id === id
        ? { ...payment, status: payment.status === 'Active' ? 'Inactive' : 'Active' }
        : payment
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Payment Options</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Payment Method
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type *</label>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gateway/Method *</label>
                <input
                  type="text"
                  name="gateway"
                  value={formData.gateway}
                  onChange={handleInputChange}
                  placeholder="e.g., Razorpay, Bank Transfer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Charges (%)</label>
                <input
                  type="number"
                  name="charges"
                  value={formData.charges}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="0.1"
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
        {['Online', 'Offline'].map(type => (
          <div key={type} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              {type === 'Online' ? <FaCreditCard className="text-blue-600 text-xl" /> : <FaUniversity className="text-green-600 text-xl" />}
              <h3 className="text-lg font-semibold text-gray-800">{type} Payments</h3>
            </div>
            <div className="space-y-3">
              {payments.filter(p => p.method === type).map(payment => (
                <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{payment.gateway}</p>
                    <p className="text-sm text-gray-600">
                      {payment.charges > 0 ? `Charges: ${payment.charges}%` : 'No charges'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleStatus(payment.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        payment.status === 'Active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {payment.status}
                    </button>
                    <button
                      onClick={() => handleEdit(payment)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
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

export default PaymentOptions;
