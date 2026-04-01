import { FaUsers, FaMoneyBillWave, FaFileInvoiceDollar, FaChartLine, FaExclamationTriangle, FaBell } from 'react-icons/fa';
import { useStudents } from '../context/StudentContext';

const Dashboard = () => {
  const { students } = useStudents();
  
  const overdueStudents = students.filter(s => (s.pendingFee || 0) > 5000);
  
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      icon: FaUsers,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Fee Collected',
      value: '₹5,67,890',
      icon: FaMoneyBillWave,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Pending Fees',
      value: '₹1,23,456',
      icon: FaFileInvoiceDollar,
      color: 'bg-orange-500',
      change: '-5%'
    },
    {
      title: 'Collection Rate',
      value: '85%',
      icon: FaChartLine,
      color: 'bg-purple-500',
      change: '+3%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back! Here's your fee management overview.
        </div>
      </div>

      {/* Alerts Section */}
      {overdueStudents.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
              <div>
                <h3 className="text-red-800 font-bold">Critical Pending Fee Alerts</h3>
                <p className="text-red-700 text-sm">{overdueStudents.length} students have high overdue balances ({'>'} ₹5,000).</p>
              </div>
            </div>
            <button className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold hover:bg-red-600 transition-colors">
              View All
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Fee Collections</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Student {item}</p>
                  <p className="text-sm text-gray-600">Class 10-A</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹5,000</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Payments</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Student {item + 5}</p>
                  <p className="text-sm text-gray-600">Class 9-B</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">₹3,500</p>
                  <p className="text-xs text-gray-500">Due: 5 days</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;