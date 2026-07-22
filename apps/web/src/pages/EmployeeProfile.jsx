import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  User, Briefcase, FileText, Award, GraduationCap, 
  Laptop, AlertTriangle, TrendingUp, DollarSign, Users,
  Calendar, MapPin, Phone, Mail, Building, Clock,
  ChevronRight, Shield, BookOpen, Activity
} from 'lucide-react';

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotifications();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/employees/${id}/360`);
      setProfile(response.data);
    } catch (err) {
      error('Failed to load employee profile');
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

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Employee not found</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'contract', label: 'Contract', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'assets', label: 'Assets', icon: Laptop },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'disciplinary', label: 'Disciplinary', icon: Shield },
    { id: 'promotions', label: 'Promotions', icon: TrendingUp },
    { id: 'salary', label: 'Salary History', icon: DollarSign },
    { id: 'dependants', label: 'Dependants', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/employees')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center"
          >
            ← Back to Employees
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-gray-600">{profile.position?.title} • {profile.department?.name}</p>
        </div>
        <div className="flex gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            profile.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {profile.status}
          </span>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{profile.firstName} {profile.lastName}</h3>
                <p className="text-sm text-gray-600">{profile.employeeId}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {profile.email}
              </div>
              {profile.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {profile.phone}
                </div>
              )}
              {profile.address && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {profile.address}, {profile.city}
                </div>
              )}
            </div>
          </div>

          {/* Employment Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{profile.position?.title}</h3>
                <p className="text-sm text-gray-600">{profile.department?.name}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Building className="w-4 h-4 mr-2" />
                {profile.department?.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Hired: {new Date(profile.hireDate).toLocaleDateString()}
              </div>
              {profile.salary && (
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  KES {profile.salary.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.employmentHistory?.length || 0}</div>
                <div className="text-xs text-gray-600">Previous Jobs</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.skills?.length || 0}</div>
                <div className="text-xs text-gray-600">Skills</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.certifications?.length || 0}</div>
                <div className="text-xs text-gray-600">Certifications</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.trainingRecords?.length || 0}</div>
                <div className="text-xs text-gray-600">Training</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-1 overflow-x-auto px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Complete Overview</h2>
              
              {/* Activity Timeline */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {profile.attendances?.slice(0, 5).map((attendance) => (
                    <div key={attendance.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(attendance.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {attendance.checkIn ? `Check-in: ${new Date(attendance.checkIn).toLocaleTimeString()}` : 'Not checked in'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tabs.slice(1).map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="w-6 h-6 text-gray-600 mb-2" />
                      <span className="text-sm text-gray-700">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'contract' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Contract Information</h2>
              {profile.contracts && profile.contracts.length > 0 ? (
                <div className="space-y-4">
                  {profile.contracts.map((contract) => (
                    <div key={contract.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{contract.type}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contract.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {contract.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Start: {new Date(contract.startDate).toLocaleDateString()}</p>
                        {contract.endDate && <p>End: {new Date(contract.endDate).toLocaleDateString()}</p>}
                        {contract.salary && <p>Salary: KES {contract.salary.toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No contracts found</p>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Skills & Expertise</h2>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.skills.map((skill) => (
                    <div key={skill.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          skill.level === 'EXPERT' ? 'bg-purple-100 text-purple-800' :
                          skill.level === 'ADVANCED' ? 'bg-blue-100 text-blue-800' :
                          skill.level === 'INTERMEDIATE' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                      {skill.category && <p className="text-sm text-gray-600">{skill.category}</p>}
                      {skill.yearsOfExperience && (
                        <p className="text-sm text-gray-600">{skill.yearsOfExperience} years experience</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills recorded</p>
              )}
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Training Records</h2>
              {profile.trainingRecords && profile.trainingRecords.length > 0 ? (
                <div className="space-y-4">
                  {profile.trainingRecords.map((training) => (
                    <div key={training.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{training.title}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          training.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          training.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {training.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Provider: {training.provider}</p>
                        <p>Date: {new Date(training.startDate).toLocaleDateString()}</p>
                        {training.cost && <p>Cost: KES {training.cost.toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No training records found</p>
              )}
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Assigned Assets</h2>
              {profile.assets && profile.assets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.assets.map((asset) => (
                    <div key={asset.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{asset.name}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          asset.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                          asset.status === 'RETURNED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {asset.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Type: {asset.type}</p>
                        <p>Assigned: {new Date(asset.assignedDate).toLocaleDateString()}</p>
                        {asset.serialNumber && <p>Serial: {asset.serialNumber}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No assets assigned</p>
              )}
            </div>
          )}

          {activeTab === 'disciplinary' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Disciplinary Records</h2>
              {profile.disciplinaryRecords && profile.disciplinaryRecords.length > 0 ? (
                <div className="space-y-4">
                  {profile.disciplinaryRecords.map((record) => (
                    <div key={record.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{record.type}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          record.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                          record.status === 'ACTIVE' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                        <p>Severity: {record.severity}</p>
                        <p>{record.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No disciplinary records</p>
              )}
            </div>
          )}

          {activeTab === 'promotions' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Promotion History</h2>
              {profile.promotionHistory && profile.promotionHistory.length > 0 ? (
                <div className="space-y-4">
                  {profile.promotionHistory.map((promotion) => (
                    <div key={promotion.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-gray-900">{promotion.type}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>From: {promotion.oldPosition || 'N/A'}</p>
                        <p>To: {promotion.newPosition}</p>
                        <p>Date: {new Date(promotion.fromDate).toLocaleDateString()}</p>
                        {promotion.newSalary && <p>New Salary: KES {promotion.newSalary.toLocaleString()}</p>}
                        <p>{promotion.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No promotion history</p>
              )}
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Salary History</h2>
              {profile.salaryHistory && profile.salaryHistory.length > 0 ? (
                <div className="space-y-4">
                  {profile.salaryHistory.map((salary) => (
                    <div key={salary.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">KES {salary.amount.toLocaleString()}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          salary.type === 'INCREMENT' ? 'bg-green-100 text-green-800' :
                          salary.type === 'DECREMENT' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {salary.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Effective: {new Date(salary.effectiveDate).toLocaleDateString()}</p>
                        <p>{salary.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No salary history</p>
              )}
            </div>
          )}

          {activeTab === 'dependants' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Dependants</h2>
              {profile.dependants && profile.dependants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.dependants.map((dependant) => (
                    <div key={dependant.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {dependant.firstName} {dependant.lastName}
                        </span>
                        {dependant.isEmergency && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Emergency
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Relationship: {dependant.relationship}</p>
                        {dependant.phone && <p>Phone: {dependant.phone}</p>}
                        {dependant.occupation && <p>Occupation: {dependant.occupation}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No dependants listed</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
