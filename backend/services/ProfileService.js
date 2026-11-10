import { User, Role } from "../models/association.js";
import bcrypt from "bcryptjs";

const getMyProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: {
      exclude: ["passwordHash"],
    },
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "name"],
    },
  });

  if (!user || !user.isActive) {
    throw new Error("Pengguna tidak ditemukan atau tidak aktif.");
  }

  return user;
};

const updateMyProfile = async (userId, { username, email }) => {
  // Cari pengguna yang sedang login
  const user = await User.findByPk(userId);

  if (!user || !user.isActive) {
    throw new Error("Pengguna tidak ditemukan atau tidak aktif.");
  }

  // Pastikan minimal ada satu data yang ingin diperbarui
  if (username === undefined && email === undefined) {
    throw new Error("Tidak ada data profil yang diperbarui.");
  }

  // Validasi username jika dikirim
  if (username !== undefined) {
    if (typeof username !== "string" || !username.trim()) {
      throw new Error("Username tidak boleh kosong.");
    }

    const existingUsername = await User.findOne({
      where: { username: username.trim() },
    });

    if (existingUsername && existingUsername.id !== user.id) {
      throw new Error("Username sudah digunakan.");
    }

    user.username = username.trim();
  }

  // Validasi email jika dikirim
  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      throw new Error("Email tidak boleh kosong.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingEmail = await User.findOne({
      where: { email: normalizedEmail },
    });

    if (existingEmail && existingEmail.id !== user.id) {
      throw new Error("Email sudah digunakan.");
    }

    user.email = normalizedEmail;
  }

  // Simpan perubahan
  await user.save();

  // Ambil data terbaru beserta role
  const updatedUser = await User.findByPk(userId, {
    attributes: {
      exclude: ["passwordHash"],
    },
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "name"],
    },
  });

  return updatedUser;
};

const changePassword = async (
  userId,
  { currentPassword, newPassword, confirmPassword },
) => {
  // Cari pengguna berdasarkan ID dari token
  const user = await User.findByPk(userId);

  if (!user || !user.isActive) {
    throw new Error("Pengguna tidak ditemukan atau tidak aktif.");
  }

  // Pastikan seluruh input diisi
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error(
      "Password lama, password baru, dan konfirmasi password wajib diisi.",
    );
  }

  // Validasi panjang password baru
  if (newPassword.length < 8) {
    throw new Error("Password baru minimal 8 karakter.");
  }

  // Pastikan password baru dan konfirmasi sama
  if (newPassword !== confirmPassword) {
    throw new Error("Konfirmasi password tidak sesuai.");
  }

  // Periksa password lama
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new Error("Password lama tidak sesuai.");
  }

  // Pastikan password baru berbeda dari password lama
  const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);

  if (isSamePassword) {
    throw new Error("Password baru tidak boleh sama dengan password lama.");
  }

  // Hash password baru
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Simpan password baru
  user.passwordHash = newPasswordHash;
  await user.save();

  return true;
};

export default {
  getMyProfile,
  updateMyProfile,
  changePassword,
};
