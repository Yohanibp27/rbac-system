import { Role, Permission, RolePermission } from "../models/association.js";
import sequelize from "../config/database.js";

const getAllRoles = async () => {
  const roles = await Role.findAll({
    include: {
      model: Permission,
      as: "permissions",
      attributes: ["id", "name", "description"],
      through: {
        attributes: [],
      },
    },
    order: [["id", "ASC"]],
  });

  return roles;
};

const updateRolePermissions = async (id, permissionIds) => {
  // Validasi format permissionIds
  if (!Array.isArray(permissionIds)) {
    throw new Error("Permission IDs harus berupa array.");
  }

  // Validasi setiap ID harus berupa bilangan bulat positif
  const validIds = permissionIds.every(
    (permissionId) => Number.isInteger(permissionId) && permissionId > 0,
  );

  if (!validIds) {
    throw new Error(
      "Setiap permission ID harus berupa bilangan bulat positif.",
    );
  }

  // Cegah ID permission duplikat
  if (new Set(permissionIds).size !== permissionIds.length) {
    throw new Error("Terdapat permission ID yang duplikat.");
  }

  // Cari role berdasarkan ID
  const role = await Role.findByPk(id);

  if (!role) {
    throw new Error("Role tidak ditemukan.");
  }

  // Lindungi role Super Admin
  if (role.name === "Super Admin") {
    throw new Error("Permission Super Admin tidak dapat diubah.");
  }

  // Pastikan semua permission ID tersedia di database
  const permissions = await Permission.findAll({
    where: {
      id: permissionIds,
    },
  });

  if (permissions.length !== permissionIds.length) {
    throw new Error("Terdapat permission ID yang tidak ditemukan.");
  }

  // Perbarui relasi role dan permission dalam transaksi
  await sequelize.transaction(async (transaction) => {
    await role.setPermissions(permissions, { transaction });
  });

  // Ambil kembali role beserta permission terbaru
  const updatedRole = await Role.findByPk(id, {
    include: {
      model: Permission,
      as: "permissions",
      attributes: ["id", "name", "description"],
      through: {
        attributes: [],
      },
    },
  });

  return updatedRole;
};

export default {
  getAllRoles,
  updateRolePermissions,
};
