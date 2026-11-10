import express from "express";

import authenticateToken from "../middleware/authMiddleware.js";
import authorizePermission from "../middleware/authorizePermission.js";
import ProfileController from "../controllers/ProfileController.js";

const router = express.Router();

// Melihat profil sendiri
router.get(
  "/",
  authenticateToken,
  authorizePermission("profile.view"),
  ProfileController.getMyProfile,
);

// Memperbarui profil sendiri
router.put(
  "/",
  authenticateToken,
  authorizePermission("profile.update"),
  ProfileController.updateMyProfile,
);

// Mengubah password sendiri
router.patch(
  "/password",
  authenticateToken,
  authorizePermission("profile.update"),
  ProfileController.changePassword,
);

export default router;
