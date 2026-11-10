import PermissionService from "../services/PermissionService.js";

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await PermissionService.getAllPermissions();

    return res.status(200).json({
      message: "Data permission berhasil diambil.",
      data: permissions,
    });
  } catch (error) {
    console.error("Get permissions error:", error.message);

    return res.status(500).json({
      message: "Gagal mengambil data permission.",
    });
  }
};

export default {
  getAllPermissions,
};
