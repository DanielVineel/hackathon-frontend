/**
 * Custom Hook: useRole
 * Provides role-based access control checks
 */

import { useCallback } from 'react';
import { useSelector } from 'react-redux';

export const useRole = () => {
  const user = useSelector(state => state.auth?.user);
  const userRole = user?.role || 'guest';

  const isStudent = useCallback(() => userRole === 'student', [userRole]);
  const isManager = useCallback(() => userRole === 'manager', [userRole]);
  const isSuperAdmin = useCallback(() => userRole === 'superadmin', [userRole]);
  const isAdmin = useCallback(() => ['manager', 'superadmin'].includes(userRole), [userRole]);

  const hasRole = useCallback((roles) => {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole);
  }, [userRole]);

  const can = useCallback((permission) => {
    const permissionMap = {
      'create-problem': ['manager', 'superadmin'],
      'edit-problem': ['manager', 'superadmin'],
      'delete-problem': ['superadmin'],
      'create-event': ['manager', 'superadmin'],
      'edit-event': ['manager', 'superadmin'],
      'delete-event': ['superadmin'],
      'manage-users': ['superadmin'],
      'view-payments': ['superadmin'],
      'view-reports': ['manager', 'superadmin'],
      'view-analytics': ['manager', 'superadmin'],
      'assign-certificates': ['manager', 'superadmin'],
      'submit-solution': ['student']
    };

    const allowedRoles = permissionMap[permission] || [];
    return allowedRoles.includes(userRole);
  }, [userRole]);

  return {
    userRole,
    user,
    isStudent,
    isManager,
    isSuperAdmin,
    isAdmin,
    hasRole,
    can
  };
};

export default useRole;
