import express from "express";

import authenticateToken from "../middleware/authMiddleware.js";
import authorizePermission from "../middleware/authorizePermission.js";
import UserController from "../controllers/UserController.js";

const router = express.Router();

// Endpoint untuk menguji permission user.view
router.get(
  "/test-view",
  authenticateToken,
  authorizePermission("user.view"),
  (req, res) => {
    return res.status(200).json({
      message: "Berhasil mengakses data pengguna.",
      user: req.user,
    });
  },
);

router.get(
  "/test-profile",
  authenticateToken,
  authorizePermission("profile.view"),
  (req, res) => {
    return res.status(200).json({
      message: "Berhasil mengakses profil.",
    });
  },
);

router.get(
  "/",
  authenticateToken,
  authorizePermission("user.view"),
  UserController.getAllUsers,
);

// Melihat detail pengguna berdasarkan ID
router.get(
  "/:id",
  authenticateToken,
  authorizePermission("user.view"),
  UserController.getUserById,
);

// Menambahkan pengguna baru
router.post(
  "/",
  authenticateToken,
  authorizePermission("user.create"),
  UserController.createUser,
);

// Memperbarui data pengguna
router.put(
  "/:id",
  authenticateToken,
  authorizePermission("user.update"),
  UserController.updateUser,
);

// Menghapus pengguna
router.delete(
  "/:id",
  authenticateToken,
  authorizePermission("user.delete"),
  UserController.deleteUser,
);

// Mengubah role pengguna
router.patch(
  "/:id/role",
  authenticateToken,
  authorizePermission("user.assign_role"),
  UserController.assignRole,
);

export default router;
