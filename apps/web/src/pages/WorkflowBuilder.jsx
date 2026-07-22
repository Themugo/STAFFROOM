import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  GitBranch, Plus, Search, Filter, Play, CheckCircle, Clock,
  AlertCircle, MoreVertical, Settings, ChevronRight, Users,
  FileText, Briefcase, DollarSign, Calendar
} from 'lucide-react';

export default function WorkflowBuilder() {
  const { success, error } = useNotifications();
  const [activeTab, setActiveTab] = useState('templates');
  const [loading, setLoading] = useState(true);
  
  // Workflow State
  const [templates, setTemplates] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  
  useEffect(() => {
    fetchWorkflowData();
  }, [activeTab]);

  const fetchWorkflowData = async () => {
    try {
      setLoading(true);
      const [temps, execs, pending] = await Promise.all([
        api.get('/workflows/templates'),
        api.get('/workflows/executions'),
        api.get('/workflows/executions/pending/my')
      ]);
      setTemplates(temps.data);
      setExecutions(execs.data);
      setPendingApprovals(pending.data);
    } catch (err) {
      error('Failed to load workflow data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'templates', label: 'Workflow Templates', icon: GitBranch },
    { id: 'executions', label: 'Executions', icon: Play },
    { id: 'approvals', label: 'My Approvals', icon: CheckCircle }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'LEAVE': return Calendar;
      case 'PROCUREMENT': return Briefcase;
      case 'RECRUITMENT': return Users;
      case 'EXPENSE': return DollarSign;
      case 'APPROVAL': return FileText;
      default: return Settings;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'LEAVE': return 'bg-blue-100 text-blue-800';
      case 'PROCUREMENT': return 'bg-green-100 text-green-800';
      case 'RECRUITMENT': return 'bg-purple-100 text-purple-800';
      case 'EXPENSE': return 'bg-red-100 text-red-800';
      case 'APPROVAL': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Workflow Builder</h1>
        <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Create Template
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Executions</p>
              <p className="text-2xl font-bold text-gray-900">
                {executions.filter(e => e.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {executions.filter(e => e.status === 'COMPLETED').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApprovals.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
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
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Workflow Templates</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const CategoryIcon = getCategoryIcon(template.category);
                  return (
                    <div key={template.id} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </span>
                        {template.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                      {template.description && (
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Version {template.version}</span>
                        <span>{template.steps?.length || 0} steps</span>
                      </div>
                      <div className="flex items-center mt-3 text-xs text-gray-600">
                        <Play className="w-3 h-3 mr-1" />
                        {template._count?.executions || 0} executions
                      </div>
                    </div>
                  );
                })}
              </div>

              {templates.length === 0 && (
                <div className="text-center py-12">
                  <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No workflow templates found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'executions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Workflow Executions</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search executions..."
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
                        Template
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Started
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {executions.map((execution) => {
                      const CategoryIcon = getCategoryIcon(execution.category);
                      return (
                        <tr key={execution.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {execution.template?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(execution.category)}`}>
                              {execution.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              execution.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              execution.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              execution.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                              execution.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {execution.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-primary-600 h-2 rounded-full"
                                  style={{ width: `${(execution.currentStep / execution.totalSteps) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">
                                {execution.currentStep}/{execution.totalSteps}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(execution.startedAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {executions.length === 0 && (
                <div className="text-center py-12">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No workflow executions found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">My Pending Approvals</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingApprovals.map((execution) => {
                  const CategoryIcon = getCategoryIcon(execution.category);
                  const currentStepExecution = execution.stepExecutions?.find(s => s.status === 'IN_PROGRESS');
                  return (
                    <div key={execution.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(execution.category)}`}>
                          {execution.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          Step {execution.currentStep + 1} of {execution.totalSteps}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {execution.template?.name}
                      </h3>
                      {currentStepExecution && (
                        <p className="text-sm text-gray-600 mb-3">
                          {currentStepExecution.step?.name}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {pendingApprovals.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending approvals</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
