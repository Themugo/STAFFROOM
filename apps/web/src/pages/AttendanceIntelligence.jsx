import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  Clock, MapPin, Smartphone, Settings, Plus, Search, Filter,
  MoreVertical, CheckCircle, AlertCircle, Calendar, Users
} from 'lucide-react';

export default function AttendanceIntelligence() {
  const { success, error } = useNotifications();
  const [activeTab, setActiveTab] = useState('shifts');
  const [loading, setLoading] = useState(true);
  
  // Attendance Intelligence State
  const [shiftSchedules, setShiftSchedules] = useState([]);
  const [employeeShifts, setEmployeeShifts] = useState([]);
  const [attendanceRules, setAttendanceRules] = useState([]);
  const [registeredDevices, setRegisteredDevices] = useState([]);
  const [attendanceLocations, setAttendanceLocations] = useState([]);
  
  useEffect(() => {
    fetchAttendanceData();
  }, [activeTab]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const [shifts, empShifts, rules, devices, locations] = await Promise.all([
        api.get('/attendance/shifts'),
        api.get('/attendance/employee-shifts'),
        api.get('/attendance/rules'),
        api.get('/attendance/devices'),
        api.get('/attendance/locations')
      ]);
      setShiftSchedules(shifts.data);
      setEmployeeShifts(empShifts.data);
      setAttendanceRules(rules.data);
      setRegisteredDevices(devices.data);
      setAttendanceLocations(locations.data);
    } catch (err) {
      error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'shifts', label: 'Shift Schedules', icon: Clock },
    { id: 'devices', label: 'Registered Devices', icon: Smartphone },
    { id: 'rules', label: 'Attendance Rules', icon: Settings },
    { id: 'locations', label: 'GPS Locations', icon: MapPin }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Intelligence</h1>
        <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Clock In
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shift Schedules</p>
              <p className="text-2xl font-bold text-gray-900">{shiftSchedules.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Registered Devices</p>
              <p className="text-2xl font-bold text-gray-900">{registeredDevices.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance Rules</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceRules.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Location Records</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceLocations.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-1 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'shifts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Shift Schedules</h2>
                <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Shift
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shiftSchedules.map((shift) => (
                  <div key={shift.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{shift.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        shift.type === 'MORNING' ? 'bg-yellow-100 text-yellow-800' :
                        shift.type === 'AFTERNOON' ? 'bg-orange-100 text-orange-800' :
                        shift.type === 'NIGHT' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {shift.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Start: {new Date(shift.startTime).toLocaleTimeString()}</p>
                      <p>End: {new Date(shift.endTime).toLocaleTimeString()}</p>
                      {shift.breakDuration && <p>Break: {shift.breakDuration} min</p>}
                      {shift.location && <p>Location: {shift.location}</p>}
                    </div>
                    {shift.isActive && (
                      <div className="flex items-center mt-2 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {shiftSchedules.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No shift schedules configured</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Registered Devices</h2>
                <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Plus className="w-5 h-5 mr-2" />
                  Register Device
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Device Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {registeredDevices.map((device) => (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {device.employee?.firstName} {device.employee?.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{device.deviceName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            device.deviceType === 'MOBILE' ? 'bg-blue-100 text-blue-800' :
                            device.deviceType === 'BIOMETRIC' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {device.deviceType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            device.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            device.status === 'BLOCKED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {device.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {device.lastUsed ? new Date(device.lastUsed).toLocaleDateString() : 'Never'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {registeredDevices.length === 0 && (
                <div className="text-center py-12">
                  <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No devices registered</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Attendance Rules</h2>
                <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Rule
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attendanceRules.map((rule) => (
                  <div key={rule.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{rule.name}</span>
                      {rule.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {rule.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{rule.action}</p>
                  </div>
                ))}
              </div>

              {attendanceRules.length === 0 && (
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No attendance rules configured</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">GPS Location Records</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search locations..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coordinates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accuracy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendanceLocations.map((location) => (
                      <tr key={location.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {location.employee?.firstName} {location.employee?.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            location.method === 'GPS' ? 'bg-green-100 text-green-800' :
                            location.method === 'BIOMETRIC' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {location.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {location.accuracy ? `±${location.accuracy}m` : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(location.timestamp).toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {attendanceLocations.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No location records found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
