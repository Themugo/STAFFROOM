import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { 
  Users, Building2, CalendarClock, TrendingUp, 
  DollarSign, Target, Activity, Award 
} from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [workforceGrowth, setWorkforceGrowth] = useState([]);
  const [departmentDistribution, setDepartmentDistribution] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [costAnalysis, setCostAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, growthRes, deptRes, attendanceRes, costRes] = await Promise.all([
        api.get('/dashboard/metrics'),
        api.get('/dashboard/workforce-growth'),
        api.get('/dashboard/department-distribution'),
        api.get('/dashboard/attendance-trends'),
        api.get('/dashboard/cost-analysis')
      ]);

      setMetrics(metricsRes.data);
      setWorkforceGrowth(growthRes.data);
      setDepartmentDistribution(deptRes.data);
      setAttendanceTrends(attendanceRes.data);
      setCostAnalysis(costRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  const executiveCards = [
    {
      title: 'Total Employees',
      value: metrics?.totalEmployees || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Departments',
      value: metrics?.activeDepartments || 0,
      icon: Building2,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Attendance Rate',
      value: `${metrics?.attendanceRate || 0}%`,
      icon: CalendarClock,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Turnover Rate',
      value: `${metrics?.turnoverRate || 0}%`,
      icon: TrendingUp,
      color: 'bg-red-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      title: 'Payroll Cost',
      value: `KES ${(metrics?.payrollCost || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Leave Utilization',
      value: `${metrics?.leaveUtilization || 0}%`,
      icon: Target,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Performance Score',
      value: `${metrics?.performanceScore || 0}/5`,
      icon: Award,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600'
    },
    {
      title: 'Active Workflows',
      value: '0',
      icon: Activity,
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-100',
      textColor: 'text-cyan-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time HR insights and analytics</p>
      </div>

      {/* Executive Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {executiveCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workforce Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Workforce Growth (12 Months)</h2>
          <div className="h-64">
            {workforceGrowth.length > 0 ? (
              <div className="flex items-end justify-between h-full gap-2">
                {workforceGrowth.map((data, index) => {
                  const maxEmployees = Math.max(...workforceGrowth.map(d => d.employees));
                  const height = (data.employees / maxEmployees) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-gray-600 mt-2 text-center">{data.month}</span>
                      <span className="text-xs font-semibold text-gray-900">{data.employees}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No workforce growth data available</p>
            )}
          </div>
        </div>

        {/* Department Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h2>
          <div className="h-64">
            {departmentDistribution.length > 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-md space-y-3">
                  {departmentDistribution.map((dept, index) => {
                    const totalEmployees = departmentDistribution.reduce((sum, d) => sum + d.employees, 0);
                    const percentage = totalEmployees > 0 ? (dept.employees / totalEmployees) * 100 : 0;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'];
                    const color = colors[index % colors.length];
                    return (
                      <div key={dept.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{dept.name}</span>
                          <span className="text-sm font-semibold text-gray-900">{dept.employees} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`${color} h-3 rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No department distribution data available</p>
            )}
          </div>
        </div>

        {/* Attendance Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends (30 Days)</h2>
          <div className="h-64">
            {attendanceTrends.length > 0 ? (
              <div className="h-full">
                <div className="flex items-end justify-between h-48 gap-1">
                  {attendanceTrends.map((data, index) => {
                    const maxRate = 100;
                    const height = data.rate;
                    const isLowAttendance = data.rate < 80;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-full rounded-t transition-all ${isLowAttendance ? 'bg-red-400 hover:bg-red-500' : 'bg-green-400 hover:bg-green-500'}`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{attendanceTrends[0]?.date}</span>
                  <span>{attendanceTrends[attendanceTrends.length - 1]?.date}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No attendance trends data available</p>
            )}
          </div>
        </div>

        {/* Cost Analysis Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis (12 Months)</h2>
          <div className="h-64">
            {costAnalysis.length > 0 ? (
              <div className="h-full">
                <div className="flex items-end justify-between h-48 gap-2">
                  {costAnalysis.map((data, index) => {
                    const maxGross = Math.max(...costAnalysis.map(d => d.gross));
                    const height = (data.gross / maxGross) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-600 mt-2 text-center">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Total Gross</p>
                      <p className="text-sm font-semibold text-gray-900">
                        KES {costAnalysis.reduce((sum, d) => sum + d.gross, 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Net</p>
                      <p className="text-sm font-semibold text-gray-900">
                        KES {costAnalysis.reduce((sum, d) => sum + d.net, 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Deductions</p>
                      <p className="text-sm font-semibold text-red-600">
                        KES {costAnalysis.reduce((sum, d) => sum + d.deductions, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No cost analysis data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
