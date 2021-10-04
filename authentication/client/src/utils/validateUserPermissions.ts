interface validateUserPermissionsParams {
  user: User;
  permissions?: string[];
  roles?: string[];
}

export const validateUserPermissions = (
  params: validateUserPermissionsParams
) => {
  const { user, permissions = [], roles = [] } = params;

  if (permissions.length) {
    const hasAllPermissions = permissions.every(permission =>
      user.permissions.includes(permission)
    );

    if (!hasAllPermissions) return false;
  }

  if (roles.length) {
    const hasAllRoles = roles.some(role => user.roles.includes(role));

    if (!hasAllRoles) return false;
  }

  return true;
}