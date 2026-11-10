import express from "express";
import AuthController from "../controllers/AuthController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", authenticateToken, AuthController.getMe);

export default router;
