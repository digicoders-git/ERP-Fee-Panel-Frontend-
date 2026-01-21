import React, { useState, useEffect } from 'react';
import { FaTimes, FaGraduationCap, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditFeeStructureModal = ({ isOpen, onClose, onEdit, feeStructure }) => {
  const [formData, setFormData] = useState({
    class: '',
    tuitionFee: '',
    examFee: '',
    libraryFee: '',
    sportsFee: '',
    labFee: ''
  });

  useEffect(() => {
    if (feeStructure) {
      setFormData({
        class: feeStructure.class || '',
        tuitionFee: feeStructure.tuitionFee?.toString() || '',
        examFee: feeStructure.examFee?.toString() || '',
        libraryFee: feeStructure.libraryFee?.toString() || '',
        sportsFee: feeStructure.sportsFee?.toString() || '',
        labFee: feeStructure.labFee?.toString() || ''
      });
    }
  }, [feeStructure]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalFee = parseInt(formData.tuitionFee || 0) + 
                    parseInt(formData.examFee || 0) + 
                    parseInt(formData.libraryFee || 0) + 
                    parseInt(formData.sportsFee || 0) + 
                    parseInt(formData.labFee || 0);
    
    onEdit(feeStructure.id, {
      ...formData,
      tuitionFee: parseInt(formData.tuitionFee || 0),
      examFee: parseInt(formData.examFee || 0),
      libraryFee: parseInt(formData.libraryFee || 0),
      sportsFee: parseInt(formData.sportsFee || 0),
      labFee: parseInt(formData.labFee || 0),
      totalFee
    });
    
    onClose();
    toast.success('Fee structure updated successfully!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Edit Fee Structure</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Class (e.g., 10th, 9th)"
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="Tuition Fee"
              value={formData.tuitionFee}
              onChange={(e) => setFormData({...formData, tuitionFee: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Exam Fee"
              value={formData.examFee}
              onChange={(e) => setFormData({...formData, examFee: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Library Fee"
              value={formData.libraryFee}
              onChange={(e) => setFormData({...formData, libraryFee: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Sports Fee"
              value={formData.sportsFee}
              onChange={(e) => setFormData({...formData, sportsFee: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Lab Fee"
              value={formData.labFee}
              onChange={(e) => setFormData({...formData, labFee: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Update Structure
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFeeStructureModal;