import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const PermissionGuard = ({ children, allowedRoles = [], fallback = null }) => {
  const { user } = useAuth();

  if (!user) {
    return fallback || <div className="text-gray-500">Please login to access this resource.</div>;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-gray-600 font-medium">Access Denied</p>
        <p className="text-sm text-gray-500 mt-1">You don't have permission to access this resource.</p>
      </div>
    );
  }

  return children;
};

export default PermissionGuard;
