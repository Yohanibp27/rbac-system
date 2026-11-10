import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiKey,
  FiUser,
} from "react-icons/fi";

function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        const payload = response.data.data ?? response.data;
        setDashboardData(payload);
      } catch (error) {
        setError(
          error.response?.data?.message || "Gagal mengambil data dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return <div className="dashboard-status">Memuat dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-status">data dashboard tidak tersedia</div>
    );
  }

  const isAdmin = user?.role === "Super Admin" || user?.role === "Admin";
  const isSupervisor = user?.role === "Supervisor";
  const isRegularUser = user?.role === "User";
  const summary = dashboardData.summary ?? {};
  const statistics = [];

  if (isAdmin) {
    statistics.push(
      {
        title: "Total User",
        value: summary.totalUsers,
        icon: <FiUsers />,
      },
      {
        title: "User Aktif",
        value: summary.activeUsers,
        icon: <FiUserCheck />,
      },
      {
        title: "User Tidak Aktif",
        value: summary.inactiveUsers,
        icon: <FiUserX />,
      },
      {
        title: "Total Role",
        value: summary.totalRoles,
        icon: <FiShield />,
      },
      {
        title: "Total Permission",
        value: summary.totalPermissions,
        icon: <FiKey />,
      },
    );
  } else if (isSupervisor) {
    statistics.push(
      {
        title: "Total Role",
        value: summary.totalRoles,
        icon: <FiShield />,
      },
      {
        title: "Total Permission",
        value: summary.totalPermissions,
        icon: <FiKey />,
      },
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Selamat datang, {user?.username}. Berikut ringkasan informasi akun
            dan sistem.
          </p>
        </div>
      </div>

      {statistics.length > 0 && (
        <div className="dashboard-statistics">
          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <div className="stat-card" key={item.title}>
                <div className="stat-card-info">
                  <p>{item.title}</p>
                  <h2>{item.value ?? 0}</h2>
                </div>

                <div className="stat-card-icon">
                  {/* <Icon /> */}
                  {item.icon}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isRegularUser && dashboardData.profile && (
        <div className="dashboard-profile">
          <div className="dashboard-section-heading">
            <FiUser />
            <h2>Informasi Profil</h2>
          </div>

          <div className="profile-information">
            <div>
              <span>Username</span>
              <strong>{dashboardData.profile.username}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{dashboardData.profile.email}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>{dashboardData.profile.role}</strong>
            </div>

            <div>
              <span>Status Akun</span>
              <strong>
                {dashboardData.profile.isActive ? "Aktif" : "Tidak Aktif"}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
