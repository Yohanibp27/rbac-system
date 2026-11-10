import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memeriksa token ketika aplikasi pertama kali dibuka
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        const payload = response.data.data ?? response.data;

        setUser(payload.user ?? payload);
      } catch (error) {
        console.error("Pemeriksaan autentikasi gagal:", error.message);

        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fungsi login
  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    const payload = response.data.data ?? response.data;

    const token = payload.token;
    const userData = payload.user ?? payload;

    if (!token) {
      throw new Error("Token tidak ditemukan dalam response login.");
    }

    localStorage.setItem("token", token);
    // setUser(userData);
    // Mengambil data user dan permission terbaru dari backend
    const profileResponse = await api.get("/auth/me");

    const profilePayload = profileResponse.data.data ?? profileResponse.data;

    setUser(profilePayload.user ?? profilePayload);

    return userData;
  };

  // Fungsi logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Memmerikasa apakah user memiliki permission tertentu
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) ?? false;
  };

  // Memeriksa apakah user memiliki satu permission
  const hasAnyPermission = (permissions) => {
    return permissions.some(hasPermission);
  };

  // Memeriksa apakah user memeiliki seluruh permission
  const hasAllPermissions = (permissions) => {
    return permissions.every(hasPermission);
  };

  const refreshUser = async () => {
    const response = await api.get("/auth/me");
    const payload = response.data.data ?? response.data;

    const userData = payload.user ?? payload;
    setUser(userData);

    return userData;
  };

  // Fungsi register
  //   const register = async (credentials) => {
  //     const response = await api.post("/auth/register", credentials);
  //   };

  const value = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
