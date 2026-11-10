import express from "express";

import authenticateToken from "../middleware/authMiddleware.js";
import authorizePermission from "../middleware/authorizePermission.js";
import PermissionController from "../controllers/PermissionController.js";

const router = express.Router();

// Melihat seluruh permission
router.get(
  "/",
  authenticateToken,
  authorizePermission("permission.view"),
  PermissionController.getAllPermissions,
);

export default router;
