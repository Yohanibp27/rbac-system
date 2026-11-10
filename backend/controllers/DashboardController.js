import DashboardService from "../services/DashboardService.js";

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const dashboardData = await DashboardService.getDashboardData(userId);

    return res.status(200).json({
      message: "Data dashboard berhasil diambil.",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Get dashboard error:", error.message);

    const statusCode =
      error.message === "Pengguna tidak ditemukan atau tidak aktif."
        ? 404
        : 500;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

export default {
  getDashboardData,
};
