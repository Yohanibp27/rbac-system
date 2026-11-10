import { User, Role, Permission } from "../models/association.js";

const getDashboardData = async (userId) => {
  // Ambil data pengguna berdasarkan ID dari token
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "name"],
    },
  });

  if (!user || !user.isActive) {
    throw new Error("Pengguna tidak ditemukan atau tidak aktif.");
  }

  const roleName = user.role.name;

  // Dashboard untuk Super Admin dan Admin
  if (roleName === "Super Admin" || roleName === "Admin") {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalRoles,
      totalPermissions,
    ] = await Promise.all([
      User.count(),
      User.count({ where: { isActive: true } }),
      User.count({ where: { isActive: false } }),
      Role.count(),
      Permission.count(),
    ]);

    return {
      role: roleName,
      summary: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalRoles,
        totalPermissions,
      },
    };
  }

  // Dashboard untuk Supervisor
  if (roleName === "Supervisor") {
    const [totalRoles, totalPermissions] = await Promise.all([
      Role.count(),
      Permission.count(),
    ]);

    return {
      role: roleName,
      summary: {
        totalRoles,
        totalPermissions,
      },
    };
  }

  // Dashboard untuk User
  return {
    role: roleName,
    profile: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  };
};

export default {
  getDashboardData,
};
