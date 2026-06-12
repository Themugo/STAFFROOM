import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Users, Building2, CalendarClock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeeRes, attendanceRes, leaveRes] = await Promise.all([
        api.get('/employees/stats'),
        api.get('/attendance/stats'),
        api.get('/leaves/stats'),
      ]);

      setStats({
        employees: employeeRes.data,
        attendance: attendanceRes.data,
        leaves: leaveRes.data,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Employees',
      value: stats?.employees?.total || 0,
      icon: Users,
      color: 'bg-blue-500',
      description: `${stats?.employees?.active || 0} active`
    },
    {
      title: 'Departments',
      value: stats?.employees?.byDepartment?.length || 0,
      icon: Building2,
      color: 'bg-green-500',
      description: 'Active departments'
    },
    {
      title: 'Present Today',
      value: stats?.attendance?.presentToday || 0,
      icon: CalendarClock,
      color: 'bg-purple-500',
      description: `${stats?.attendance?.absentToday || 0} absent`
    },
    {
      title: 'Pending Leaves',
      value: stats?.leaves?.pending || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      description: 'Awaiting approval'
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{card.title}</p>
            <p className="text-xs text-gray-500 mt-2">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Employees by Department</h2>
          {stats?.employees?.byDepartment?.length > 0 ? (
            <div className="space-y-3">
              {stats.employees.byDepartment.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{dept.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{dept.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No department data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Overview</h2>
          {stats?.leaves ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Pending</span>
                <span className="text-sm font-semibold text-orange-600">{stats.leaves.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Approved</span>
                <span className="text-sm font-semibold text-green-600">{stats.leaves.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Rejected</span>
                <span className="text-sm font-semibold text-red-600">{stats.leaves.rejected}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No leave data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
