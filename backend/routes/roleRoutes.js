import express from "express";

import authenticateToken from "../middleware/authMiddleware.js";
import authorizePermission from "../middleware/authorizePermission.js";
import RoleController from "../controllers/RoleController.js";

const router = express.Router();

// Melihat seluruh role
router.get(
  "/",
  authenticateToken,
  authorizePermission("role.view"),
  RoleController.getAllRoles,
);

// Mengatur permission pada role
router.put(
  "/:id/permissions",
  authenticateToken,
  authorizePermission("role.manage_permissions"),
  RoleController.updateRolePermissions,
);

export default router;
