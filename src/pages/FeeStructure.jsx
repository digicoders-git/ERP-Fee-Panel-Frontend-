import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AddFeeStructureModal from '../components/AddFeeStructureModal';
import EditFeeStructureModal from '../components/EditFeeStructureModal';

const FeeStructure = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [feeStructures, setFeeStructures] = useState([]);

  useEffect(() => {
    const savedStructures = localStorage.getItem('feeStructures');
    if (savedStructures) {
      setFeeStructures(JSON.parse(savedStructures));
    } else {
      const defaultStructures = [
        { id: 1, class: '10th', tuitionFee: 5000, examFee: 1000, libraryFee: 500, sportsFee: 300, labFee: 200, totalFee: 7000 },
        { id: 2, class: '9th', tuitionFee: 4500, examFee: 1000, libraryFee: 500, sportsFee: 300, labFee: 200, totalFee: 6500 },
        { id: 3, class: '8th', tuitionFee: 4000, examFee: 800, libraryFee: 400, sportsFee: 200, labFee: 100, totalFee: 5500 }
      ];
      setFeeStructures(defaultStructures);
      localStorage.setItem('feeStructures', JSON.stringify(defaultStructures));
    }
  }, []);

  const handleAddStructure = (newStructure) => {
    const structure = {
      id: Date.now(),
      ...newStructure
    };
    const updatedStructures = [...feeStructures, structure];
    setFeeStructures(updatedStructures);
    localStorage.setItem('feeStructures', JSON.stringify(updatedStructures));
  };

  const handleEditStructure = (id, updatedData) => {
    const updatedStructures = feeStructures.map(structure => 
      structure.id === id ? { ...structure, ...updatedData } : structure
    );
    setFeeStructures(updatedStructures);
    localStorage.setItem('feeStructures', JSON.stringify(updatedStructures));
  };

  const handleDeleteStructure = (structure) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete fee structure for ${structure.class}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedStructures = feeStructures.filter(s => s.id !== structure.id);
        setFeeStructures(updatedStructures);
        localStorage.setItem('feeStructures', JSON.stringify(updatedStructures));
        toast.success(`Fee structure for ${structure.class} deleted successfully!`);
      }
    });
  };

  const handleEdit = (structure) => {
    setSelectedStructure(structure);
    setShowEditModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Fee Structure</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Fee Structure</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuition Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Library Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sports Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lab Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {feeStructures.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{fee.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{fee.tuitionFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{fee.examFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{fee.libraryFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{fee.sportsFee || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{fee.labFee || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">₹{fee.totalFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(fee)}
                        className="text-green-600 cursor-pointer hover:text-green-900"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteStructure(fee)}
                        className="text-red-600 cursor-pointer hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddFeeStructureModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddStructure}
      />
      
      <EditFeeStructureModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEditStructure}
        feeStructure={selectedStructure}
      />
    </>
  );
};

export default FeeStructure;