import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const StudentContext = createContext();

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch maximum limit so client-side filters keep working as they were
      const res = await api.get('/api/fee-panel/dashboard/students?limit=1000');
      if (res.data && res.data.students) {
        // Map backend properties to match static frontend structure
        const mapped = res.data.students.map(s => ({
          id: s._id,
          displayId: s.admissionNumber || s.rollNumber || 'N/A',
          name: s.name,
          class: s.class?.className || (typeof s.class === 'string' ? s.class : 'N/A'),
          rollNo: s.rollNumber || '',
          admissionNumber: s.admissionNumber || '',
          phone: s.mobile || '',
          email: s.email || '',
          address: s.address || '',
          totalFee: s.totalFee || 0,
          paidFee: s.paidFee || 0,
          pendingFee: s.pendingFee || 0
        }));
        setStudents(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const updateStudent = async (id, updatedData) => {
    // In a real app we would call a PUT endpoint, but to keep the flow working we update locally and refetch later if needed.
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, ...updatedData } : student
    );
    setStudents(updatedStudents);
  };

  const collectFee = async (studentId, amount, details = {}) => {
    try {
      const payload = {
        studentId,
        amount: parseFloat(amount),
        paymentMethod: details.paymentMethod || 'Cash',
        transactionId: details.transactionId,
        chequeNumber: details.chequeNumber,
        upiId: details.upiId
      };
      await api.post('/api/fee-panel/payment/manual-collect', payload);
      // Refresh students to get latest fee balances
      await fetchStudents();
    } catch (err) {
      toast.error('Failed to collect fee via API');
      console.error('Collect fee error:', err);
    }
  };

  return (
    <StudentContext.Provider value={{ students, updateStudent, collectFee, loading, fetchStudents }}>
      {children}
    </StudentContext.Provider>
  );
};