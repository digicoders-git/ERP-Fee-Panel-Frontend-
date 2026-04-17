import React, { useState } from 'react';
import { FaTimes, FaGraduationCap, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddFeeStructureModal = ({ isOpen, onClose, onAdd, classes = [] }) => {
  const [formData, setFormData] = useState({
    classId: '',
    tuitionFee: '',
    examFee: '',
    libraryFee: '',
    sportsFee: '',
    labFee: '',
    hostelFee: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalFee = parseInt(formData.tuitionFee || 0) + 
                    parseInt(formData.examFee || 0) + 
                    parseInt(formData.libraryFee || 0) + 
                    parseInt(formData.sportsFee || 0) + 
                    parseInt(formData.labFee || 0) + 
                    parseInt(formData.hostelFee || 0);
    
    onAdd({
      ...formData,
      tuitionFee: parseInt(formData.tuitionFee || 0),
      examFee: parseInt(formData.examFee || 0),
      libraryFee: parseInt(formData.libraryFee || 0),
      sportsFee: parseInt(formData.sportsFee || 0),
      labFee: parseInt(formData.labFee || 0),
      hostelFee: parseInt(formData.hostelFee || 0),
      totalFee
    });
    
    setFormData({
      classId: '',
      tuitionFee: '',
      examFee: '',
      libraryFee: '',
      sportsFee: '',
      labFee: '',
      hostelFee: ''
    });
    onClose();
    toast.success('Fee structure added successfully!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Add Fee Structure</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <select
              value={formData.classId}
              onChange={(e) => setFormData({...formData, classId: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className} {cls.stream && cls.stream.length > 0 ? `(${cls.stream.join(', ')})` : ''}
                </option>
              ))}
            </select>
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

          <div className="relative">
            <input
              type="number"
              placeholder="Hostel Fee"
              value={formData.hostelFee}
              onChange={(e) => setFormData({...formData, hostelFee: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Structure
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

export default AddFeeStructureModal;