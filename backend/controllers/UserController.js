import UserService from "../services/UserService.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();

    return res.status(200).json({
      message: "Data pengguna berhasil diambil.",
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error.message);

    return res.status(500).json({
      message: "Gagal mengambil data pengguna.",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "Pengguna tidak ditemukan.",
      });
    }

    return res.status(200).json({
      message: "Detail pengguna berhasil diambil.",
      data: user,
    });
  } catch (error) {
    console.error("Get user detail error:", error.message);

    return res.status(500).json({
      message: "Gagal mengambil detail pengguna.",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);

    return res.status(201).json({
      message: "Pengguna berhasil ditambahkan.",
      data: user,
    });
  } catch (error) {
    console.error("Create user error:", error.message);

    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserService.updateUser(id, req.body);

    return res.status(200).json({
      message: "Data pengguna berhasil diperbarui.",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error.message);

    const statusCode =
      error.message === "Pengguna tidak ditemukan." ? 404 : 400;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = req.user.id;

    const deletedUser = await UserService.deleteUser(id, requesterId);

    return res.status(200).json({
      message: "Pengguna berhasil dihapus.",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Delete user error:", error.message);

    let statusCode = 400;

    if (error.message === "Pengguna tidak ditemukan.") {
      statusCode = 404;
    }

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

const assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;
    const requesterId = req.user.id;

    if (!roleName) {
      return res.status(400).json({
        message: "Role tujuan wajib diisi.",
      });
    }

    const user = await UserService.assignRole(id, roleName, requesterId);

    return res.status(200).json({
      message: "Role pengguna berhasil diperbarui.",
      data: user,
    });
  } catch (error) {
    console.error("Assign role error:", error.message);

    const statusCode =
      error.message === "Pengguna tidak ditemukan." ||
      error.message === "Role tujuan tidak ditemukan." ||
      error.message === "Akun pemohon tidak ditemukan."
        ? 404
        : 400;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  assignRole,
};
