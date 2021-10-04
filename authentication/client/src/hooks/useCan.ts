import { useAuth } from "../context/AuthContext";

interface UseCanParams {
  permissions?: string[];
  roles?: string[];
}

export const useCan = (params: UseCanParams) => {
  const { permissions = [], roles = [] } = params;

  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return false;

  
  if (permissions.length) {
    const hasAllPermissions = permissions.every(permission =>
      user.permissions.includes(permission)
    );

    if (!hasAllPermissions) return false;

    return true;
  }

  if (roles.length) {
    const hasAllRoles = roles.some(role => user.roles.includes(role));

    if (!hasAllRoles) return false;

    return true;
  }

}