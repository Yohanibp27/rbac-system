import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// function ProtectedRoute() {
//   const { isAuthenticated, isLoading } = useAuth();

//   // Tunggu sampai pemeriksaan token selesai
//   if (isLoading) {
//     return <h2>Memeriksa autentikasi...</h2>;
//   }

//   // Jika belum login, arahkan ke halaman Login
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // Jika sudah login, tampilkan halaman yang diminta
//   return <Outlet />;
// }

function ProtectedRoute({ permission, permissions, requireAll = false }) {
  const {
    isAuthenticated,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuth();

  // Menunggu pemeriksaan autentikasi selesai
  if (isLoading) {
    return <h2>Memeriksa autentikasi...</h2>;
  }

  // Memeriksa apakah user sudah login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Memeriksa permission jika ditentukan
  let isAllowed = true;

  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (permissions) {
    isAllowed = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // Jika tidak memiliki permission
  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
