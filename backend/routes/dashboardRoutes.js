import express from "express";
import DashboardController from "../controllers/DashboardController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, DashboardController.getDashboardData);

export default router;
