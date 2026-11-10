import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";
import { Sequelize } from "sequelize";

import {
  Role,
  Permission,
  User,
  RolePermission,
} from "./models/association.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import permissionRoutes from "./routes/permissionRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "RBAC API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, http://localhost:${PORT}`);
});

const startServer = async () => {
  try {
    // Menguji koneksi database
    await db.authenticate();
    console.log("Database connected successfully");

    // Membuat tabel berdasarkan model Sequelize
    await db.sync();

    // Membuat tabel berdasarkan model Sequelize
    await db.sync();
    console.log("All models synchronized successfully.");

    // Menjalankan server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Unable to connect to database");
    console.error(e.message);
  }
};

startServer();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
