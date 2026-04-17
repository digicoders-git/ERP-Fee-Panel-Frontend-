import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const FeeConfiguration = () => {
  const [feeConfigs, setFeeConfigs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    classId: '',
    tuitionFee: '',
    examFee: '',
    sportsFee: ''
  });

  useEffect(() => {
    fetchConfigs();
    fetchClasses();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/fee-panel/fee-structure/all');
      if (response.data && response.data.feeStructures) {
        setFeeConfigs(response.data.feeStructures);
      }
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast.error('Failed to load fee configurations');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/class/all');
      if (response.data && response.data.classes) {
        setClasses(response.data.classes);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const tuition = parseFloat(formData.tuitionFee) || 0;
    const exam = parseFloat(formData.examFee) || 0;
    const sports = parseFloat(formData.sportsFee) || 0;
    return tuition + exam + sports;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.classId || !formData.tuitionFee) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const dataToSend = {
        class: formData.classId,
        tuitionFee: parseFloat(formData.tuitionFee),
        examFee: parseFloat(formData.examFee) || 0,
        sportsFee: parseFloat(formData.sportsFee) || 0
      };

      if (editingId) {
        await api.put(`/api/fee-panel/fee-structure/${editingId}`, dataToSend);
        toast.success('Fee configuration updated');
      } else {
        await api.post('/api/fee-panel/fee-structure/create', dataToSend);
        toast.success('Fee configuration added');
      }
      fetchConfigs();
      setFormData({ classId: '', tuitionFee: '', examFee: '', sportsFee: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error(error.response?.data?.message || 'Failed to save configuration');
    }
  };

  const handleEdit = (config) => {
    setFormData({
      classId: config.class?._id || config.class,
      tuitionFee: config.tuitionFee,
      examFee: config.examFee,
      sportsFee: config.sportsFee
    });
    setEditingId(config._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this configuration?')) return;
    try {
      await api.delete(`/api/fee-panel/fee-structure/${id}`);
      toast.success('Fee configuration deleted');
      fetchConfigs();
    } catch (error) {
      console.error('Error deleting config:', error);
      toast.error('Failed to delete configuration');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ classId: '', tuitionFee: '', examFee: '', sportsFee: '' });
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
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee *</label>
                <input
                  type="number"
                  name="tuitionFee"
                  value={formData.tuitionFee}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Fee</label>
                <input
                  type="number"
                  name="examFee"
                  value={formData.examFee}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Fee</label>
                <input
                  type="number"
                  name="sportsFee"
                  value={formData.sportsFee}
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
              <tr key={config._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-700">
                  {typeof config.class === 'object' ? config.class.className : config.class}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">₹{config.tuitionFee}</td>
                <td className="px-6 py-3 text-sm text-gray-700">₹{config.examFee}</td>
                <td className="px-6 py-3 text-sm text-gray-700">₹{config.sportsFee}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">₹{config.totalFee}</td>
                <td className="px-6 py-3 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(config)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(config._id)}
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
