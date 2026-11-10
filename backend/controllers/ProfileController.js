import ProfileService from "../services/ProfileService.js";

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await ProfileService.getMyProfile(userId);

    return res.status(200).json({
      message: "Profil berhasil diambil.",
      data: profile,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    const statusCode =
      error.message === "Pengguna tidak ditemukan atau tidak aktif."
        ? 404
        : 500;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await ProfileService.updateMyProfile(userId, req.body);

    return res.status(200).json({
      message: "Profil berhasil diperbarui.",
      data: profile,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    const statusCode =
      error.message === "Pengguna tidak ditemukan atau tidak aktif."
        ? 404
        : 400;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    await ProfileService.changePassword(userId, req.body);

    return res.status(200).json({
      message: "Password berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Change password error:", error.message);

    const statusCode =
      error.message === "Pengguna tidak ditemukan atau tidak aktif."
        ? 404
        : 400;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

export default {
  getMyProfile,
  updateMyProfile,
  changePassword,
};
