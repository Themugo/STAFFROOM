import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Plus, Building2, Users } from 'lucide-react';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary-100">
                <Building2 className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm text-gray-500">{dept.location || 'No location'}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
            {dept.description && (
              <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
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
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No departments found</p>
        </div>
      )}
    </div>
  );
}
