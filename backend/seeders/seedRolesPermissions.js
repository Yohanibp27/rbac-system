import sequelize from "../config/database.js";

import { Role, Permission, RolePermission } from "../models/association.js";

const rolesData = [
  {
    name: "Super Admin",
    description: "Memiliki seluruh hak akses sistem.",
  },
  {
    name: "Admin",
    description: "Mengelola data pengguna dan mengakses fitur administrasi.",
  },
  {
    name: "Supervisor",
    description: "Melihat informasi role, permission, dan laporan.",
  },
  {
    name: "User",
    description: "Mengakses dan mengelola profil sendiri.",
  },
];

const permissionsData = [
  {
    name: "user.view",
    description: "Melihat data pengguna.",
  },
  {
    name: "user.create",
    description: "Menambahkan pengguna.",
  },
  {
    name: "user.update",
    description: "Mengubah data pengguna.",
  },
  {
    name: "user.delete",
    description: "Menghapus pengguna.",
  },
  {
    name: "user.assign_role",
    description: "Menetapkan role kepada pengguna.",
  },
  {
    name: "role.view",
    description: "Melihat data role.",
  },
  {
    name: "permission.view",
    description: "Melihat daftar permission.",
  },
  {
    name: "report.view",
    description: "Melihat laporan.",
  },
  {
    name: "report.export",
    description: "Mengekspor laporan.",
  },
  {
    name: "profile.view",
    description: "Melihat profil sendiri.",
  },
  {
    name: "profile.update",
    description: "Mengubah profil sendiri.",
  },
  {
    name: "role.manage_permissions",
    description: "Mengatur permission yang dimiliki oleh role",
  },
];

// Pemetaan permission untuk setiap role
const rolePermissionsData = {
  "Super Admin": [
    "user.view",
    "user.create",
    "user.update",
    "user.delete",
    "user.assign_role",
    "role.view",
    "permission.view",
    "report.view",
    "report.export",
    "profile.view",
    "profile.update",
    "role.manage_permissions",
  ],

  Admin: [
    "user.view",
    "user.create",
    "user.update",
    "user.assign_role",
    "role.view",
    "permission.view",
    "report.view",
    "report.export",
    "profile.view",
    "profile.update",
  ],

  Supervisor: [
    "role.view",
    "permission.view",
    "report.view",
    "report.export",
    "profile.view",
    "profile.update",
  ],

  User: ["profile.view", "profile.update"],
};

const seedDatabase = async () => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Memasukkan data Role
    for (const roleData of rolesData) {
      await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData,
        transaction,
      });
    }

    // 2. Memasukkan data Permission
    for (const permissionData of permissionsData) {
      await Permission.findOrCreate({
        where: { name: permissionData.name },
        defaults: permissionData,
        transaction,
      });
    }

    // 3. Menghubungkan Role dengan Permission
    for (const [roleName, permissionNames] of Object.entries(
      rolePermissionsData,
    )) {
      const role = await Role.findOne({
        where: { name: roleName },
        transaction,
      });

      for (const permissionName of permissionNames) {
        const permission = await Permission.findOne({
          where: { name: permissionName },
          transaction,
        });

        await RolePermission.findOrCreate({
          where: {
            roleId: role.id,
            permissionId: permission.id,
          },
          defaults: {
            roleId: role.id,
            permissionId: permission.id,
          },
          transaction,
        });
      }
    }

    await transaction.commit();

    console.log("Roles seeded successfully.");
    console.log("Permissions seeded successfully.");
    console.log("Role permissions assigned successfully.");
  } catch (error) {
    await transaction.rollback();

    console.error("Seeding failed:");
    console.error(error.message);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
