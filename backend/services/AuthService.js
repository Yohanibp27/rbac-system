import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User, Role, Permission } from "../models/association.js";

const register = async ({ username, email, password }) => {
  // 1. Validasi input
  if (!username || !email || !password) {
    throw new Error("Username, email, dan password wajib diisi.");
  }

  // 2. Validasi panjang password
  if (password.length < 8) {
    throw new Error("Password minimal 8 karakter.");
  }

  // 3. Periksa apakah email sudah terdaftar
  const existingEmail = await User.findOne({
    where: { email },
  });

  if (existingEmail) {
    throw new Error("Email sudah digunakan.");
  }

  // 4. Periksa apakah username sudah digunakan
  const existingUsername = await User.findOne({
    where: { username },
  });

  if (existingUsername) {
    throw new Error("Username sudah digunakan.");
  }

  // 5. Cari role default User
  const defaultRole = await Role.findOne({
    where: { name: "User" },
  });

  if (!defaultRole) {
    throw new Error("Role default User tidak ditemukan.");
  }

  // 6. Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // 7. Simpan pengguna baru
  const newUser = await User.create({
    username,
    email,
    passwordHash,
    roleId: defaultRole.id,
  });

  // 8. Kembalikan data pengguna tanpa password
  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    roleId: newUser.roleId,
  };
};

const login = async ({ email, password }) => {
  // 1. Validasi input
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi.");
  }

  // 2. Cari pengguna berdasarkan email
  const user = await User.findOne({
    where: { email },
    include: {
      model: Role,
      as: "role",
    },
  });

  if (!user) {
    throw new Error("Email atau password salah.");
  }

  // 3. Periksa status akun
  if (!user.isActive) {
    throw new Error("Akun tidak aktif.");
  }

  // 4. Verifikasi password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Email atau password salah.");
  }

  // 5. Membuat JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  // 6. Mengembalikan token dan informasi pengguna
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
    },
  };
};

// Mendefinisikan fungsi mengambil data user beserta permission
const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: {
      exclude: ["passwordHash"],
    },
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "name"],
      include: {
        model: Permission,
        as: "permissions",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    },
  });

  if (!user || !user.isActive) {
    throw new Error("Pengguna tidak ditemukan atau tidak aktif.");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role.name,
    permissions: user.role.permissions.map((permission) => permission.name),
  };
};

export default {
  register,
  login,
  getCurrentUser,
};
