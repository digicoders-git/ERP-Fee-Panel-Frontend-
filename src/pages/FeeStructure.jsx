import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AddFeeStructureModal from '../components/AddFeeStructureModal';
import EditFeeStructureModal from '../components/EditFeeStructureModal';
import api from '../utils/api';

const FeeStructure = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [feeStructures, setFeeStructures] = useState([]);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const response = await api.get('/api/fee-panel/fee-structure/all');
        if (response.data && response.data.feeStructures) {
          // Map backend DB fields to UI expectation format
          const mapped = response.data.feeStructures.map(f => ({
            id: f._id,
            classId: typeof f.class === 'object' ? f.class?._id : f.class,
            class: typeof f.class === 'object' ? f.class?.className : (f.class || 'N/A'),
            tuitionFee: f.tuitionFee || 0,
            examFee: f.examFee || 0,
            libraryFee: f.libraryFee || 0,
            hostelFee: f.hostelFee || 0,
            sportsFee: f.sportsFee || 0,
            labFee: f.labFee || 0,
            totalFee: f.totalFee || 0
          }));
          setFeeStructures(mapped);
        }
      } catch (error) {
        toast.error('Failed to load fee structures');
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await api.get('/api/class/all?limit=100');
        if (response.data && response.data.classes) {
          setClassList(response.data.classes);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };

    fetchStructures();
    fetchClasses();
  }, []);

  const handleAddStructure = async (newStructure) => {
    try {
      const response = await api.post('/api/fee-panel/fee-structure/add', newStructure);
      const f = response.data.feeStructure;
      const mapped = {
        id: f._id,
        classId: typeof f.class === 'object' ? f.class?._id : f.class,
        class: typeof f.class === 'object' ? f.class?.className : (f.class || 'N/A'),
        tuitionFee: f.tuitionFee || 0,
        examFee: f.examFee || 0,
        libraryFee: f.libraryFee || 0,
        hostelFee: f.hostelFee || 0,
        sportsFee: f.sportsFee || 0,
        labFee: f.labFee || 0,
        totalFee: f.totalFee || 0
      };
      setFeeStructures([...feeStructures, mapped]);
      toast.success('Fee structure added successfully!');
    } catch (error) {
      toast.error('Failed to add fee structure');
    }
  };

  const handleEditStructure = async (id, updatedData) => {
    try {
      await api.put(`/api/fee-panel/fee-structure/${id}`, updatedData);
      
      // Since updatedData only contains the new values, we need to handle the class mapping if it changed
      // But simpler is to just refetch to ensure everything is in sync with backend population
      const response = await api.get('/api/fee-panel/fee-structure/all');
      if (response.data && response.data.feeStructures) {
        const mapped = response.data.feeStructures.map(f => ({
          id: f._id,
          classId: typeof f.class === 'object' ? f.class?._id : f.class,
          class: typeof f.class === 'object' ? f.class?.className : (f.class || 'N/A'),
          tuitionFee: f.tuitionFee || 0,
          examFee: f.examFee || 0,
          libraryFee: f.libraryFee || 0,
          hostelFee: f.hostelFee || 0,
          sportsFee: f.sportsFee || 0,
          labFee: f.labFee || 0,
          totalFee: f.totalFee || 0
        }));
        setFeeStructures(mapped);
      }
      toast.success('Fee structure updated successfully!');
    } catch (error) {
      toast.error('Failed to update fee structure');
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/fee-panel/fee-structure/${structure.id}`);
          const updatedStructures = feeStructures.filter(s => s.id !== structure.id);
          setFeeStructures(updatedStructures);
          toast.success(`Fee structure for ${structure.class} deleted successfully!`);
        } catch (error) {
          toast.error('Failed to delete fee structure');
        }
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hostel Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sports Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lab Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {feeStructures.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {typeof fee.class === 'object' ? (fee.class?.className || 'N/A') : fee.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{fee.tuitionFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{fee.examFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{fee.libraryFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{fee.hostelFee || 0}</td>
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
        classes={classList}
      />
      
      <EditFeeStructureModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEditStructure}
        feeStructure={selectedStructure}
        classes={classList}
      />
    </>
  );
};

export default FeeStructure;