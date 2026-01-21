import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const staticStudents = [
      { 
        id: 1, 
        name: 'Rahul Sharma', 
        class: '10-A', 
        rollNo: '001', 
        phone: '9876543210', 
        email: 'rahul@email.com',
        address: '123 Main St, Delhi',
        totalFee: 15000,
        paidFee: 15000,
        pendingFee: 0
      },
      { 
        id: 2, 
        name: 'Priya Singh', 
        class: '9-B', 
        rollNo: '002', 
        phone: '9876543211', 
        email: 'priya@email.com',
        address: '456 Park Ave, Mumbai',
        totalFee: 12000,
        paidFee: 8000,
        pendingFee: 4000
      },
      { 
        id: 3, 
        name: 'Amit Kumar', 
        class: '10-A', 
        rollNo: '003', 
        phone: '9876543212', 
        email: 'amit@email.com',
        address: '789 Lake View, Bangalore',
        totalFee: 15000,
        paidFee: 0,
        pendingFee: 15000
      },
      { 
        id: 4, 
        name: 'Sneha Patel', 
        class: '8-C', 
        rollNo: '004', 
        phone: '9876543213', 
        email: 'sneha@email.com',
        address: '321 Hill Road, Pune',
        totalFee: 10000,
        paidFee: 10000,
        pendingFee: 0
      },
      { 
        id: 5, 
        name: 'Vikash Gupta', 
        class: '9-A', 
        rollNo: '005', 
        phone: '9876543214', 
        email: 'vikash@email.com',
        address: '654 Garden St, Chennai',
        totalFee: 12000,
        paidFee: 5000,
        pendingFee: 7000
      },
      { 
        id: 6, 
        name: 'Anita Verma', 
        class: '11-A', 
        rollNo: '006', 
        phone: '9876543215', 
        email: 'anita@email.com',
        address: '789 Park Street, Kolkata',
        totalFee: 18000,
        paidFee: 12000,
        pendingFee: 6000
      },
      { 
        id: 7, 
        name: 'Ravi Kumar', 
        class: '12-B', 
        rollNo: '007', 
        phone: '9876543216', 
        email: 'ravi@email.com',
        address: '456 MG Road, Hyderabad',
        totalFee: 20000,
        paidFee: 20000,
        pendingFee: 0
      },
      { 
        id: 8, 
        name: 'Pooja Sharma', 
        class: '7-C', 
        rollNo: '008', 
        phone: '9876543217', 
        email: 'pooja@email.com',
        address: '123 Civil Lines, Jaipur',
        totalFee: 8000,
        paidFee: 3000,
        pendingFee: 5000
      },
      { 
        id: 9, 
        name: 'Arjun Singh', 
        class: '11-B', 
        rollNo: '009', 
        phone: '9876543218', 
        email: 'arjun@email.com',
        address: '567 Ring Road, Ahmedabad',
        totalFee: 18000,
        paidFee: 0,
        pendingFee: 18000
      },
      { 
        id: 10, 
        name: 'Kavya Reddy', 
        class: '10-C', 
        rollNo: '010', 
        phone: '9876543219', 
        email: 'kavya@email.com',
        address: '890 Tech City, Bangalore',
        totalFee: 15000,
        paidFee: 12000,
        pendingFee: 3000
      },
      { 
        id: 11, 
        name: 'Rohit Jain', 
        class: '9-C', 
        rollNo: '011', 
        phone: '9876543220', 
        email: 'rohit@email.com',
        address: '234 Market St, Indore',
        totalFee: 12000,
        paidFee: 0,
        pendingFee: 12000
      },
      { 
        id: 12, 
        name: 'Meera Agarwal', 
        class: '8-A', 
        rollNo: '012', 
        phone: '9876543221', 
        email: 'meera@email.com',
        address: '345 Lake Side, Udaipur',
        totalFee: 10000,
        paidFee: 10000,
        pendingFee: 0
      },
      { 
        id: 13, 
        name: 'Karan Malhotra', 
        class: '12-A', 
        rollNo: '013', 
        phone: '9876543222', 
        email: 'karan@email.com',
        address: '678 Business District, Gurgaon',
        totalFee: 20000,
        paidFee: 8000,
        pendingFee: 12000
      },
      { 
        id: 14, 
        name: 'Divya Nair', 
        class: '11-C', 
        rollNo: '014', 
        phone: '9876543223', 
        email: 'divya@email.com',
        address: '789 Coastal Road, Kochi',
        totalFee: 18000,
        paidFee: 18000,
        pendingFee: 0
      },
      { 
        id: 15, 
        name: 'Siddharth Roy', 
        class: '10-B', 
        rollNo: '015', 
        phone: '9876543224', 
        email: 'siddharth@email.com',
        address: '456 Heritage Lane, Kolkata',
        totalFee: 15000,
        paidFee: 2000,
        pendingFee: 13000
      }
    ];
    
    // Clear old data and set new data
    localStorage.removeItem('students');
    setStudents(staticStudents);
    localStorage.setItem('students', JSON.stringify(staticStudents));
  }, []);

  const updateStudent = (id, updatedData) => {
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, ...updatedData } : student
    );
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const collectFee = (studentId, amount) => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        const currentPending = student.pendingFee || 0;
        const currentPaid = student.paidFee || 0;
        const totalFee = student.totalFee || 0;
        
        // Validate amount doesn't exceed pending fee
        const actualAmount = Math.min(amount, currentPending);
        
        // Calculate new values
        const newPending = currentPending - actualAmount;
        const newPaid = currentPaid + actualAmount;
        
        // Ensure paid + pending = total fee
        return {
          ...student,
          pendingFee: newPending,
          paidFee: newPaid
        };
      }
      return student;
    });
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  return (
    <StudentContext.Provider value={{ students, updateStudent, collectFee }}>
      {children}
    </StudentContext.Provider>
  );
};