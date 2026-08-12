import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

const DepartmentContext = createContext(undefined);

export const DEFAULT_DEPARTMENTS = [
  {
    id: 'dept_exec',
    department_id: 'dept_exec',
    name: 'Executive',
    code: 'EXEC',
    description: 'Executive Leadership, Strategy, & Corporate Governance',
    head: 'Alex Vance',
    memberCount: 12,
  },
  {
    id: 'dept_hr',
    department_id: 'dept_hr',
    name: 'People Operations',
    code: 'HR',
    description: 'Human Resources, Talent Acquisition, & Employee Experience',
    head: 'Sarah Jenkins',
    memberCount: 28,
  },
  {
    id: 'dept_eng',
    department_id: 'dept_eng',
    name: 'Engineering',
    code: 'ENG',
    description: 'Software Engineering, Infrastructure, DevOps, & Technical Ops',
    head: 'David Miller',
    memberCount: 84,
  },
  {
    id: 'dept_fin',
    department_id: 'dept_fin',
    name: 'Finance & Accounting',
    code: 'FIN',
    description: 'Financial Planning, Global Payroll, Tax, & Accounting',
    head: 'Michael Chen',
    memberCount: 19,
  },
  {
    id: 'dept_sales',
    department_id: 'dept_sales',
    name: 'Sales & Marketing',
    code: 'SALES',
    description: 'Enterprise Sales, Business Development, & Brand Marketing',
    head: 'Rachel Green',
    memberCount: 45,
  },
  {
    id: 'dept_ops',
    department_id: 'dept_ops',
    name: 'Operations & Logistics',
    code: 'OPS',
    description: 'Facilities, Procurement, Workplace Management, & Logistics',
    head: 'James Wilson',
    memberCount: 32,
  },
];

export const DepartmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);

  // Derive user's department ID based on user object (e.g. user.department_id or string match)
  const userDepartmentId = useMemo(() => {
    if (!user) return 'dept_hr';
    if (user.department_id) return user.department_id;

    const userDeptName = (user.department || '').toLowerCase();
    const found = DEFAULT_DEPARTMENTS.find(
      (d) =>
        d.name.toLowerCase() === userDeptName ||
        d.code.toLowerCase() === userDeptName ||
        d.id.toLowerCase() === userDeptName
    );
    return found ? found.id : 'dept_hr';
  }, [user]);

  // Active department filter state ('ALL' or specific department_id)
  const [activeDepartmentId, setActiveDepartmentId] = useState(() => {
    try {
      const stored = localStorage.getItem('staffroom_active_department_id');
      return stored || 'ALL';
    } catch {
      return 'ALL';
    }
  });

  // Strict scope enforcement flag
  const [strictScopeEnforcement, setStrictScopeEnforcement] = useState(false);

  // Save selection to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('staffroom_active_department_id', activeDepartmentId);
    } catch {}
  }, [activeDepartmentId]);

  // Determine if current user can view all departments
  const isElevatedRole = useMemo(() => {
    if (!user) return true;
    const role = (user.role || '').toLowerCase();
    return (
      role.includes('admin') ||
      role.includes('owner') ||
      role.includes('executive') ||
      role.includes('director') ||
      role.includes('system')
    );
  }, [user]);

  // Effective department ID to use for filtering (Strictly lock non-elevated roles to their assigned department)
  const effectiveDepartmentId = useMemo(() => {
    if (!isElevatedRole) {
      return userDepartmentId;
    }
    return activeDepartmentId;
  }, [isElevatedRole, userDepartmentId, activeDepartmentId]);

  // Helper method to filter data arrays by department_id or department name
  const filterByDepartment = (items = [], departmentKey = 'department_id') => {
    if (!Array.isArray(items)) return [];
    if (effectiveDepartmentId === 'ALL') return items;

    const targetDept = departments.find((d) => d.id === effectiveDepartmentId);

    return items.filter((item) => {
      if (!item) return false;

      // 1. Check exact match on department_id
      const itemDeptId = item[departmentKey] || item.department_id;
      if (itemDeptId && itemDeptId === effectiveDepartmentId) return true;

      // 2. Fallback check on string department name or code
      const itemDeptName = item.department || item.department_name;
      if (itemDeptName && targetDept) {
        const itemLower = String(itemDeptName).toLowerCase();
        return (
          itemLower === targetDept.name.toLowerCase() ||
          itemLower === targetDept.code.toLowerCase() ||
          itemLower === targetDept.id.toLowerCase()
        );
      }

      return false;
    });
  };

  const userDepartment = useMemo(
    () => departments.find((d) => d.id === userDepartmentId) || departments[0],
    [departments, userDepartmentId]
  );

  const activeDepartment = useMemo(
    () => departments.find((d) => d.id === effectiveDepartmentId) || null,
    [departments, effectiveDepartmentId]
  );

  const resetDepartmentFilter = () => {
    setActiveDepartmentId('ALL');
  };

  const value = {
    departments,
    setDepartments,
    userDepartmentId,
    userDepartment,
    activeDepartmentId: effectiveDepartmentId,
    rawActiveDepartmentId: activeDepartmentId,
    activeDepartment,
    setActiveDepartmentId,
    resetDepartmentFilter,
    filterByDepartment,
    isDepartmentScoped: effectiveDepartmentId !== 'ALL',
    isElevatedRole,
    strictScopeEnforcement,
    setStrictScopeEnforcement,
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartment must be used within a DepartmentProvider');
  }
  return context;
};

export default DepartmentContext;
