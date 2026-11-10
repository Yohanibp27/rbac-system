import { User, Role, Permission } from "../models/association.js";
import bcrypt from "bcryptjs";

const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: {
      exclude: ["passwordHash"],
    },
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "name"],
    },
    order: [["id", "ASC"]],
  });

  return users;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: {
      exclude: ["passwordHash"],
    },
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "name"],
    },
  });

  return user;
};

const createUser = async ({ username, email, password }) => {
  // Validasi input wajib
  if (!username || !email || !password) {
    throw new Error("Username, email, dan password wajib diisi.");
  }

  // Validasi panjang password
  if (password.length < 8) {
    throw new Error("Password minimal 8 karakter.");
  }

  // Periksa username yang sudah digunakan
  const existingUsername = await User.findOne({
    where: { username },
  });

  if (existingUsername) {
    throw new Error("Username sudah digunakan.");
  }

  // Periksa email yang sudah digunakan
  const existingEmail = await User.findOne({
    where: { email },
  });

  if (existingEmail) {
    throw new Error("Email sudah digunakan.");
  }

  // Cari role default User
  const defaultRole = await Role.findOne({
    where: { name: "User" },
  });

  if (!defaultRole) {
    throw new Error("Role default User tidak ditemukan.");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Simpan pengguna baru
  const newUser = await User.create({
    username,
    email,
    passwordHash,
    roleId: defaultRole.id,
  });

  // Kembalikan data tanpa password hash
  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    roleId: newUser.roleId,
    isActive: newUser.isActive,
  };
};

const updateUser = async (id, { username, email, isActive }) => {
  // Cari pengguna berdasarkan ID
  const user = await User.findByPk(id);

  if (!user) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  // Periksa username jika ingin diubah
  if (username !== undefined) {
    if (!username.trim()) {
      throw new Error("Username tidak boleh kosong.");
    }

    const existingUsername = await User.findOne({
      where: { username },
    });

    if (existingUsername && existingUsername.id !== user.id) {
      throw new Error("Username sudah digunakan.");
    }

    user.username = username;
  }

  // Periksa email jika ingin diubah
  if (email !== undefined) {
    if (!email.trim()) {
      throw new Error("Email tidak boleh kosong.");
    }

    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail && existingEmail.id !== user.id) {
      throw new Error("Email sudah digunakan.");
    }

    user.email = email;
  }

  // Periksa status akun jika dikirim
  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new Error("Status akun harus berupa boolean.");
    }

    user.isActive = isActive;
  }

  // Simpan perubahan
  await user.save();

  // Ambil data terbaru tanpa password hash
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
    isActive: user.isActive,
    updatedAt: user.updatedAt,
  };
};

const deleteUser = async (id, requesterId) => {
  // Cari pengguna yang akan dihapus beserta role-nya
  const user = await User.findByPk(id, {
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "name"],
    },
  });

  if (!user) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  // Mencegah pengguna menghapus akunnya sendiri
  if (Number(user.id) === Number(requesterId)) {
    throw new Error("Anda tidak dapat menghapus akun sendiri.");
  }

  // Jika target adalah Super Admin, periksa jumlah Super Admin
  if (user.role.name === "Super Admin") {
    const totalSuperAdmin = await User.count({
      where: {
        roleId: user.roleId,
      },
    });

    if (totalSuperAdmin <= 1) {
      throw new Error("Super Admin terakhir tidak dapat dihapus.");
    }
  }

  // Hapus pengguna dari database
  await user.destroy();

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

const assignRole = async (id, roleName, requesterId) => {
  // Cari akun yang melakukan perubahan role
  const requester = await User.findByPk(requesterId, {
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "name"],
    },
  });

  if (!requester) {
    throw new Error("Akun pemohon tidak ditemukan.");
  }

  // Cari pengguna yang role-nya akan diubah
  const user = await User.findByPk(id, {
    include: {
      model: Role,
      as: "role",
      attributes: ["id", "name"],
    },
  });

  if (!user) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  // Mencegah perubahan role akun sendiri
  if (Number(user.id) === Number(requesterId)) {
    throw new Error("Anda tidak dapat mengubah role sendiri.");
  }

  // Cari role tujuan
  const newRole = await Role.findOne({
    where: { name: roleName },
  });

  if (!newRole) {
    throw new Error("Role tujuan tidak ditemukan.");
  }

  // Admin tidak boleh mengubah akun Super Admin
  if (requester.role.name === "Admin" && user.role.name === "Super Admin") {
    throw new Error("Admin tidak dapat mengubah role Super Admin.");
  }

  // Hanya Super Admin yang boleh memberikan role Super Admin
  if (newRole.name === "Super Admin" && requester.role.name !== "Super Admin") {
    throw new Error(
      "Hanya Super Admin yang dapat memberikan role Super Admin.",
    );
  }

  // Cegah penghapusan Super Admin terakhir melalui perubahan role
  if (user.role.name === "Super Admin" && newRole.name !== "Super Admin") {
    const totalSuperAdmin = await User.count({
      where: {
        roleId: user.roleId,
      },
    });

    if (totalSuperAdmin <= 1) {
      throw new Error("Role Super Admin terakhir tidak dapat diubah.");
    }
  }

  // Simpan role baru
  user.roleId = newRole.id;
  await user.save();

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: {
      id: newRole.id,
      name: newRole.name,
    },
  };
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  assignRole,
};
