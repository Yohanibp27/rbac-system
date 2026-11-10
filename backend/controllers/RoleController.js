import RoleService from "../services/RoleService.js";

const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleService.getAllRoles();

    return res.status(200).json({
      message: "Data role berhasil diambil.",
      data: roles,
    });
  } catch (error) {
    console.error("Get roles error:", error.message);

    return res.status(500).json({
      message: "Gagal mengambil data role.",
    });
  }
};

const updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;

    const role = await RoleService.updateRolePermissions(id, permissionIds);

    return res.status(200).json({
      message: "Permission role berhasil diperbarui.",
      data: role,
    });
  } catch (error) {
    console.error("Update role permissions error:", error.message);

    const notFoundErrors = [
      "Role tidak ditemukan.",
      "Terdapat permission ID yang tidak ditemukan.",
    ];

    const statusCode = notFoundErrors.includes(error.message) ? 404 : 400;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

export default {
  getAllRoles,
  updateRolePermissions,
};
