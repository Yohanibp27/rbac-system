import { User, Role, Permission } from "../models/association.js";

const authorizePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // 1. Memastikan pengguna sudah terautentikasi
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          message: "Pengguna belum terautentikasi.",
        });
      }

      // 2. Mengambil data pengguna beserta role dan permission
      const user = await User.findByPk(req.user.id, {
        include: {
          model: Role,
          as: "role",
          include: {
            model: Permission,
            as: "permissions",
            through: {
              attributes: [],
            },
          },
        },
      });

      // 3. Memastikan pengguna masih tersedia dan aktif
      if (!user || !user.isActive) {
        return res.status(401).json({
          message: "Pengguna tidak ditemukan atau tidak aktif.",
        });
      }

      // 4. Mengambil daftar permission pengguna
      const userPermissions = user.role.permissions.map(
        (permission) => permission.name,
      );

      // 5. Memeriksa permission yang dibutuhkan
      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: "Anda tidak memiliki izin untuk mengakses fitur ini.",
        });
      }

      // 6. Melanjutkan request
      next();
    } catch (error) {
      console.error("Authorization error:", error.message);

      return res.status(500).json({
        message: "Terjadi kesalahan saat memeriksa hak akses.",
      });
    }
  };
};

export default authorizePermission;
