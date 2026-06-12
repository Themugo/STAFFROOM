import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Plus, Building2, Users, ChevronRight, ChevronDown, Settings, User, MoreVertical } from 'lucide-react';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'hierarchy'
  const [loading, setLoading] = useState(true);
  const [expandedDepts, setExpandedDepts] = useState({});

  useEffect(() => {
    fetchDepartments();
    fetchHierarchy();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments?includeHierarchy=true');
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHierarchy = async () => {
    try {
      const response = await api.get('/departments/hierarchy');
      setHierarchy(response.data);
    } catch (error) {
      console.error('Failed to fetch hierarchy:', error);
    }
  };

  const toggleExpand = (deptId) => {
    setExpandedDepts(prev => ({
      ...prev,
      [deptId]: !prev[deptId]
    }));
  };

  const renderHierarchyItem = (dept, level = 0) => {
    const isExpanded = expandedDepts[dept.id];
    const hasChildren = dept.children && dept.children.length > 0;

    return (
      <div key={dept.id} className="mb-2">
        <div 
          className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors cursor-pointer"
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => hasChildren && toggleExpand(dept.id)}
        >
          {hasChildren && (
            <button className="mr-2 p-1 hover:bg-gray-100 rounded">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6 mr-2" />}
          
          <div className="flex-1">
            <div className="flex items-center">
              <Building2 className="w-5 h-5 text-primary-600 mr-2" />
              <span className="font-medium text-gray-900">{dept.name}</span>
              {dept.code && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {dept.code}
                </span>
              )}
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {dept._count?.employees || 0} employees
              {dept.head && (
                <>
                  <span className="mx-2">•</span>
                  <User className="w-4 h-4 mr-1" />
                  {dept.head.firstName} {dept.head.lastName}
                </>
              )}
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {dept.children.map(child => renderHierarchyItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage organizational structure and hierarchy</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'card' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'hierarchy' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hierarchy View
            </button>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Add Department
          </button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary-100">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex items-center gap-2">
                  {dept.status === 'ACTIVE' ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {dept.status?.toLowerCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{dept.name}</h3>
              {dept.code && (
                <p className="text-sm text-gray-500 mb-2">Code: {dept.code}</p>
              )}
              
              {dept.description && (
                <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
              )}

              {dept.parentDepartment && (
                <div className="mb-3 text-sm">
                  <span className="text-gray-500">Parent:</span>
                  <span className="ml-1 text-gray-900 font-medium">{dept.parentDepartment.name}</span>
                </div>
              )}

              {dept.head && (
                <div className="mb-3 flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Head:</span>
                  <span className="ml-1 text-gray-900 font-medium">
                    {dept.head.firstName} {dept.head.lastName}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {dept._count?.employees || 0} employees
                </div>
                {dept.budget && (
                  <span className="text-sm font-medium text-gray-900">
                    KES {dept.budget?.toLocaleString()}
                  </span>
                )}
              </div>

              {dept._count?.subDepartments > 0 && (
                <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                  {dept._count.subDepartments} sub-department{dept._count.subDepartments > 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Organizational Hierarchy</h2>
          {hierarchy.length > 0 ? (
            <div className="space-y-2">
              {hierarchy.map(dept => renderHierarchyItem(dept))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No departments found</p>
            </div>
          )}
        </div>
      )}

      {departments.length === 0 && viewMode === 'card' && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No departments found</p>
        </div>
      )}
    </div>
  );
}
