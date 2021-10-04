import { useAuth } from "../context/AuthContext";
import { validateUserPermissions } from "../utils/validateUserPermissions";

interface UseCanParams {
  permissions?: string[];
  roles?: string[];
}

export const useCan = (params: UseCanParams) => {
  const { permissions = [], roles = [] } = params;

  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return false;

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  })

  return userHasValidPermissions;
}