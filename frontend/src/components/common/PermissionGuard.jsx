import { useAuth } from "../../context/AuthContext";

function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null,
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  let isAllowed = false;

  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (permissions) {
    isAllowed = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return isAllowed ? children : fallback;
}

export default PermissionGuard;
