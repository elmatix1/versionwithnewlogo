
import { UserRole } from './types';

// Cartographie des permissions d'accès par rôle
export const ROLE_ACCESS_MAP: Record<UserRole, string[]> = {
  'admin': ['/', '/users', '/hr', '/vehicles', '/planning', '/orders', '/inventory', '/maintenance', '/reports', '/settings'],
  'rh': ['/', '/hr'],
  'planificateur': ['/', '/planning', '/vehicles'],
  'commercial': ['/', '/orders', '/reports'],
  'approvisionneur': ['/', '/inventory', '/orders'],
  'exploitation': ['/', '/vehicles', '/planning'],
  'maintenance': ['/', '/vehicles', '/maintenance']
};

// Cartographie des actions permises par rôle
export const ACTION_PERMISSIONS: Record<string, UserRole[]> = {
  'add-user': ['admin'],
  'edit-user': ['admin'],
  'delete-user': ['admin'],
  'manage-roles': ['admin'],
  'add-vehicle': ['admin', 'exploitation'],
  'edit-vehicle': ['admin', 'exploitation', 'maintenance'],
  'add-order': ['admin', 'commercial'],
  'edit-order': ['admin', 'commercial'],
  'add-inventory': ['admin', 'approvisionneur'],
  'add-planning': ['admin', 'planificateur'],
  'edit-planning': ['admin', 'planificateur'],
  'manage-hr': ['admin', 'rh']
};

/**
 * Check if a user has permission for the given required roles
 */
export const checkRolePermission = (userRole: UserRole | undefined, requiredRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  if (requiredRoles.length === 0) return true; // Aucun rôle requis
  return requiredRoles.includes(userRole);
};

/**
 * Check if a user has permission for a specific action
 */
export const checkActionPermission = (userRole: UserRole | undefined, action: string): boolean => {
  if (!userRole) return false;
  
  if (!ACTION_PERMISSIONS[action]) return false;
  
  return ACTION_PERMISSIONS[action].includes(userRole);
};
