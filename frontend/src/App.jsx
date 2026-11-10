import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Layout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Login from "./pages/Auth/Login.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import Register from "./pages/auth/Register.jsx";
import Users from "./pages/users/Users.jsx";
import Roles from "./pages/roles/Roles.jsx";
import Permissions from "./pages/permissions/Permissions.jsx";
import Profile from "./pages/profile/Profile.jsx";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <h2>Mmeeriksa autentikasi...</h2>;
  }

  return (
    <Routes>
      {/* Halaman Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ForgotPassword />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      {/* Halaman yang membutuhkan autentikasi */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Halaman Manajemen User */}
          <Route element={<ProtectedRoute permission="user.view" />}>
            <Route path="/users" element={<Users />} />
          </Route>

          {/* Halaman Manajemen Role */}
          <Route element={<ProtectedRoute permission="role.view" />}>
            <Route path="/roles" element={<Roles />} />
          </Route>

          {/* Halaman Manajemen Permission */}
          <Route element={<ProtectedRoute permission="permission.view" />}>
            <Route path="/permissions" element={<Permissions />} />
          </Route>

          {/* Halaman Manajemen User */}
          <Route element={<ProtectedRoute permission="profile.view" />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Route>

      {/* Halaman Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Halaman yang tidak ditemukan */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "login"} replace />
        }
      />
    </Routes>
  );
}

export default App;

// import React, { useEffect } from "react";
// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
// import api from "./services/api.js";

// import Layout from "./layouts/Layout.jsx";
// import Login from "./pages/Auth/Login.jsx";

// import "./App.css";

// function App() {
//   useEffect(() => {
//     const testConnection = async () => {
//       try {
//         const response = await api.get("/dashboard");

//         console.log("Koneksi berhasil:", response.data);
//       } catch (error) {
//         if (error.response) {
//           console.log(
//             "Backend memberikan response:",
//             error.response.status,
//             error.response.data,
//           );
//         } else {
//           console.error("Koneksi gagal:", error.message);
//         }
//       }
//     };

//     testConnection();
//   }, []);

//   return (
//     <BrowserRouter>
//       <Login />
//     </BrowserRouter>
//   );
// }

// export default App;
