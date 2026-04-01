import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const FeeConfiguration = () => {
  const [feeConfigs, setFeeConfigs] = useState([
    { id: 1, class: 'Class 1', tuition: 5000, exam: 500, activity: 300, total: 5800 },
    { id: 2, class: 'Class 2', tuition: 5500, exam: 500, activity: 300, total: 6300 },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    class: '',
    tuition: '',
    exam: '',
    activity: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const tuition = parseFloat(formData.tuition) || 0;
    const exam = parseFloat(formData.exam) || 0;
    const activity = parseFloat(formData.activity) || 0;
    return tuition + exam + activity;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.class || !formData.tuition) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingId) {
      setFeeConfigs(prev => prev.map(config => 
        config.id === editingId 
          ? { ...config, ...formData, total: calculateTotal() }
          : config
      ));
      toast.success('Fee configuration updated');
      setEditingId(null);
    } else {
      const newConfig = {
        id: Date.now(),
        ...formData,
        tuition: parseFloat(formData.tuition),
        exam: parseFloat(formData.exam),
        activity: parseFloat(formData.activity),
        total: calculateTotal()
      };
      setFeeConfigs(prev => [...prev, newConfig]);
      toast.success('Fee configuration added');
    }
    
    setFormData({ class: '', tuition: '', exam: '', activity: '' });
    setShowForm(false);
  };

  const handleEdit = (config) => {
    setFormData({
      class: config.class,
      tuition: config.tuition,
      exam: config.exam,
      activity: config.activity
    });
    setEditingId(config.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setFeeConfigs(prev => prev.filter(config => config.id !== id));
    toast.success('Fee configuration deleted');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ class: '', tuition: '', exam: '', activity: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Fee Configuration</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Configuration
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Fee Configuration' : 'Add New Fee Configuration'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  placeholder="e.g., Class 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee *</label>
                <input
                  type="number"
                  name="tuition"
                  value={formData.tuition}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Fee</label>
                <input
                  type="number"
                  name="exam"
                  value={formData.exam}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Fee</label>
                <input
                  type="number"
                  name="activity"
                  value={formData.activity}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">
                Total Fee: ₹{calculateTotal().toFixed(2)}
              </p>
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tuition</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Exam</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Activity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feeConfigs.map(config => (
              <tr key={config.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-700">{config.class}</td>
                <td className="px-6 py-3 text-sm text-gray-700">₹{config.tuition}</td>
                <td className="px-6 py-3 text-sm text-gray-700">₹{config.exam}</td>
                <td className="px-6 py-3 text-sm text-gray-700">₹{config.activity}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">₹{config.total}</td>
                <td className="px-6 py-3 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(config)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(config.id)}
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

export default FeeConfiguration;
