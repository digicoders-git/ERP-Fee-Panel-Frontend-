import React, { useState } from 'react';
import { FaChartBar, FaDownload, FaUsers, FaMoneyBillWave, FaChartPie } from 'react-icons/fa';
import { useStudents } from '../context/StudentContext';

const Reports = () => {
  const { students } = useStudents();
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Download functions
  const downloadStudentReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Class,Roll No,Phone,Total Fee,Paid Fee,Pending Fee\n" +
      students.map(s => `${s.name},${s.class},${s.rollNo},${s.phone},${s.totalFee || 0},${s.paidFee || 0},${s.pendingFee || 0}`).join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "student_report.csv");
    link.click();
  };

  const downloadFeeReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Class,Total Fee,Paid Fee,Pending Fee,Status\n" +
      students.map(s => {
        const status = (s.pendingFee || 0) === 0 ? 'Paid' : (s.pendingFee || 0) > 5000 ? 'Overdue' : 'Pending';
        return `${s.name},${s.class},${s.totalFee || 0},${s.paidFee || 0},${s.pendingFee || 0},${status}`;
      }).join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "fee_collection_report.csv");
    link.click();
  };

  const downloadClassReport = () => {
    const classData = {};
    students.forEach(s => {
      if (!classData[s.class]) {
        classData[s.class] = { total: 0, paid: 0, pending: 0, students: 0 };
      }
      classData[s.class].students++;
      classData[s.class].total += s.totalFee || 0;
      classData[s.class].paid += s.paidFee || 0;
      classData[s.class].pending += s.pendingFee || 0;
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Class,Students,Total Fee,Paid Fee,Pending Fee\n" +
      Object.entries(classData).map(([className, data]) => 
        `${className},${data.students},${data.total},${data.paid},${data.pending}`
      ).join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "class_wise_report.csv");
    link.click();
  };

  // Calculate statistics
  const totalStudents = students.length;
  const paidStudents = students.filter(s => (s.pendingFee || 0) === 0).length;
  const pendingStudents = students.filter(s => (s.pendingFee || 0) > 0 && (s.pendingFee || 0) <= 5000).length;
  const overdueStudents = students.filter(s => (s.pendingFee || 0) > 5000).length;
  
  const totalFeeAmount = students.reduce((sum, s) => sum + (s.totalFee || 0), 0);
  const totalPaidAmount = students.reduce((sum, s) => sum + (s.paidFee || 0), 0);
  const totalPendingAmount = students.reduce((sum, s) => sum + (s.pendingFee || 0), 0);

  // Ultra Modern 3D Pie Chart Component
  const ModernPieChart = ({ data, title, size = 400 }) => {
    const radius = size / 2 - 60;
    const centerX = size / 2;
    const centerY = size / 2;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    if (total === 0) return null;
    
    let cumulativeAngle = 0;
    
    const createPath = (startAngle, endAngle, innerRadius = 0) => {
      const start = polarToCartesian(centerX, centerY, radius, endAngle);
      const end = polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      
      const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle);
      const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle);
      return [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", innerEnd.x, innerEnd.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        "Z"
      ].join(" ");
    };
    
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative mb-8">
          {/* Glowing background */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-200/30 via-purple-200/20 to-transparent rounded-full blur-xl"></div>
          
          <svg width={size} height={size} className="relative z-10">
            {/* Outer glow effect */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/> 
                </feMerge>
              </filter>
              
              {/* Gradient definitions */}
              {data.map((item, index) => (
                <radialGradient key={`gradient-${index}`} id={`gradient-${index}`} cx="30%" cy="30%">
                  <stop offset="0%" stopColor={item?.color || '#3B82F6'} stopOpacity="1" />
                  <stop offset="100%" stopColor={item?.color || '#3B82F6'} stopOpacity="0.7" />
                </radialGradient>
              ))}
            </defs>
            
            {/* Shadow layer */}
            <g transform="translate(3, 3)" opacity="0.3">
              {data.map((item, index) => {
                const angle = (item.value / total) * 360;
                const startAngle = cumulativeAngle;
                const endAngle = cumulativeAngle + angle;
                const tempAngle = cumulativeAngle;
                cumulativeAngle += angle;
                
                return (
                  <path
                    key={`shadow-${index}`}
                    d={createPath(startAngle, endAngle, size * 0.2)}
                    fill="#000000"
                  />
                );
              })}
            </g>
            
            {/* Reset cumulative angle for main segments */}
            {(() => { cumulativeAngle = 0; return null; })()}
            
            {/* Main pie segments */}
            {data.map((item, index) => {
              const angle = (item.value / total) * 360;
              const startAngle = cumulativeAngle;
              const endAngle = cumulativeAngle + angle;
              cumulativeAngle += angle;
              
              const isHovered = hoveredSegment === index;
              const midAngle = startAngle + angle / 2;
              const offsetDistance = isHovered ? 15 : 0;
              const offsetX = Math.cos((midAngle - 90) * Math.PI / 180) * offsetDistance;
              const offsetY = Math.sin((midAngle - 90) * Math.PI / 180) * offsetDistance;
              
              return (
                <g key={index} transform={`translate(${offsetX}, ${offsetY})`}>
                  <path
                    d={createPath(startAngle, endAngle, size * 0.2)}
                    fill={`url(#gradient-${index})`}
                    stroke="white"
                    strokeWidth="4"
                    filter="url(#glow)"
                    className="transition-all duration-500 cursor-pointer"
                    style={{
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: `${centerX}px ${centerY}px`,
                      filter: isHovered ? 'url(#glow) brightness(1.1) saturate(1.2)' : 'url(#glow)'
                    }}
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                  
                  {/* 3D edge effect */}
                  <path
                    d={createPath(startAngle, endAngle, size * 0.2)}
                    fill="none"
                    stroke={item?.color || '#3B82F6'}
                    strokeWidth="2"
                    opacity="0.8"
                    className="pointer-events-none"
                  />
                  
                  {/* Percentage labels with glow */}
                  {angle > 10 && (
                    <text
                      x={polarToCartesian(centerX, centerY, radius * 0.75, startAngle + angle / 2).x}
                      y={polarToCartesian(centerX, centerY, radius * 0.75, startAngle + angle / 2).y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-lg font-black fill-white pointer-events-none"
                      style={{ 
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))'
                      }}
                    >
                      {((item.value / total) * 100).toFixed(0)}%
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Center circle with gradient */}
            <defs>
              <radialGradient id="centerGradient" cx="50%" cy="30%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f8fafc" />
              </radialGradient>
            </defs>
            <circle
              cx={centerX}
              cy={centerY}
              r={size * 0.2}
              fill="url(#centerGradient)"
              stroke="#e2e8f0"
              strokeWidth="3"
              filter="drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
            />
            
            {/* Center content */}
            <text
              x={centerX}
              y={centerY - 15}
              textAnchor="middle"
              className="text-4xl font-black fill-gray-800"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            >
              {total}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              className="text-base font-semibold fill-gray-600"
            >
              Total
            </text>
          </svg>
          
          {/* Floating tooltip */}
          {hoveredSegment !== null && (
            <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-white/50 z-20 transform transition-all duration-300 scale-105">
              <div className="flex items-center space-x-3 mb-2">
                <div 
                  className="w-4 h-4 rounded-full shadow-lg" 
                  style={{ backgroundColor: data[hoveredSegment]?.color || '#3B82F6' }}
                ></div>
                <span className="font-bold text-gray-800">{data[hoveredSegment]?.name || 'Unknown'}</span>
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">
                {(data[hoveredSegment]?.value || 0).toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-gray-600">
                {(((data[hoveredSegment]?.value || 0) / total) * 100).toFixed(1)}% of total
              </div>
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-black text-gray-800 mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h3>
        
        {/* Ultra modern legend */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div 
                key={index} 
                className="group relative overflow-hidden bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-1"
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{
                  background: hoveredSegment === index ? 
                    `linear-gradient(135deg, ${item?.color || '#3B82F6'}15, ${item?.color || '#3B82F6'}05)` : 
                    'linear-gradient(135deg, #ffffff, #f8fafc)'
                }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ background: `linear-gradient(135deg, ${item?.color || '#3B82F6'}10, transparent)` }}></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-6 h-6 rounded-full shadow-lg ring-2 ring-white transform group-hover:scale-110 transition-transform duration-300" 
                      style={{ 
                        backgroundColor: item?.color || '#3B82F6',
                        boxShadow: `0 0 20px ${item?.color || '#3B82F6'}40`
                      }}
                    ></div>
                    <span className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors">
                      {item?.name || 'Unknown'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-gray-900 group-hover:scale-110 transition-transform duration-300">
                      {(item?.value || 0).toLocaleString()}
                    </div>
                    <div className="text-sm font-semibold text-gray-500">
                      {percentage}%
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${item?.color || '#3B82F6'}, ${item?.color || '#3B82F6'}80)`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Students</h3>
            <FaUsers className="text-blue-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
          <p className="text-sm text-gray-600">Enrolled</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Collection</h3>
            <FaMoneyBillWave className="text-green-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-green-600">₹{totalPaidAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Collected</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pending Fees</h3>
            <FaChartBar className="text-orange-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-orange-600">₹{totalPendingAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Outstanding</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Collection Rate</h3>
            <FaChartPie className="text-purple-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{Math.round((totalPaidAmount / totalFeeAmount) * 100)}%</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
      </div>

      {/* Ultra Modern Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
        {/* Student Status Chart */}
        <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl shadow-2xl p-10 border border-white/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
          <div className="relative z-10">
            <ModernPieChart 
              data={[
                { name: 'Paid', value: paidStudents, color: '#00D4AA' },
                { name: 'Pending', value: pendingStudents, color: '#FFB800' },
                { name: 'Overdue', value: overdueStudents, color: '#FF6B6B' }
              ].filter(item => item.value > 0)}
              title="Student Fee Status"
              size={450}
            />
          </div>
        </div>

        {/* Fee Amount Chart */}
        <div className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl shadow-2xl p-10 border border-white/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-3xl"></div>
          <div className="relative z-10">
            <ModernPieChart 
              data={[
                { name: 'Collected', value: Math.round(totalPaidAmount), color: '#00D4AA' },
                { name: 'Pending', value: Math.round(totalPendingAmount), color: '#FF6B6B' }
              ].filter(item => item.value > 0)}
              title="Fee Collection (₹)"
              size={450}
            />
          </div>
        </div>
      </div>

      {/* Download Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Download Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => downloadStudentReport()}
            className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center  cursor-pointer space-x-2"
          >
            <FaDownload />
            <span>Student Report</span>
          </button>
          <button 
            onClick={() => downloadFeeReport()}
            className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center cursor-pointer  space-x-2"
          >
            <FaDownload />
            <span>Fee Collection Report</span>
          </button>
          <button 
            onClick={() => downloadClassReport()}
            className="bg-purple-500 cursor-pointer  text-white py-3 px-4 rounded-lg hover:bg-purple-600 flex items-center justify-center space-x-2"
          >
            <FaDownload />
            <span>Class-wise Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;