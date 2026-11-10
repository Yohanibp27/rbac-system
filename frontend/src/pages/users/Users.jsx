import React, { useEffect, useState, useMemo } from "react";
import UserService from "../../services/userService";
import { FiPlus, FiX, FiEdit2, FiShield, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import RoleService from "../../services/roleService.js";
import { getErrorMessage } from "../../utils/errorHandler.js";
import {
  validateRequired,
  validateEmail,
  validatePassword,
} from "../../utils/validators.js";

function Users() {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [showEditForm, setShowEditForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [showRoleForm, setShowRoleForm] = useState(false);
  const [isAssigningRole, setIsAssigningRole] = useState(false);
  const [roleError, setRoleError] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRoleUser, setSelectedRoleUser] = useState(null);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [editData, setEditData] = useState({
    username: "",
    email: "",
    isActive: true,
  });

  const canCreateUser = hasPermission("user.create");
  const canUpdateUser = hasPermission("user.update");
  const canAssignRole = hasPermission("user.assign_role");
  const canDeleteUser = hasPermission("user.delete");

  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      //   setError(error.message?.data?.message || "Gagal mengambil data user");
      getErrorMessage(error, "Gagal mengambil data pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //   useEffect(() => {
  //     const fetchUsers = async () => {
  //       try {
  //         const response = await UserService.getAllUsers();
  //         setUsers(response.data);
  //       } catch (error) {
  //         setError(error.response?.data?.message || "Gagal mengambil data user.");
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     fetchUsers();
  //   }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();
      return (
        user.username.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.role?.name?.toLowerCase().includes(keyword)
      );
    });
  }, [users, search]);

  // Add
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });

    setFormError("");
  };

  const handleCloseForm = () => {
    if (isSubmitting) return;

    setShowCreateForm(false);
    resetForm();
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (formData.password.length < 8) {
      setFormError("Password minimal terdiri dari 8 karakter");
      return;
    }

    try {
      setIsSubmitting(true);

      const usernameError = validateRequired(formData.username, "Username");
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      if (usernameError || emailError || passwordError) {
        setErrorMessage(usernameError || emailError || passwordError);
        return;
      }

      await UserService.createUser(formData);

      setSuccessMessage("User berhasil ditambahkan");
      setShowCreateForm(false);
      resetForm();

      const response = await UserService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      //   setFormData(error.response?.data?.message || "Gagal menambahkan user");
      getErrorMessage(error, "Gagal menambahkan user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit
  const handleOpenEditForm = (user) => {
    setSelectedUser(user);

    setEditData({
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    });

    setEditError("");
    setSuccessMessage("");
    setShowEditForm(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    setEditError("");
    setSuccessMessage("");

    try {
      setIsUpdating(true);

      await UserService.updateUser(selectedUser.id, editData);

      setSuccessMessage("Informasi user berhasil diperbarui.");
      setShowEditForm(false);
      setSelectedUser(null);

      await fetchUsers();
    } catch (error) {
      //   setEditError(
      //     error.response?.data?.message || "Gagal memperbarui informasi user.",
      //   );
      getErrorMessage(error, "Gagal memperbarui informasi user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseEditForm = () => {
    if (isUpdating) return;

    setShowEditForm(false);
    setSelectedUser(null);
    setEditError("");
  };

  // Role assign
  const handleOpenRoleForm = async (user) => {
    setSelectedRoleUser(user);
    setSelectedRoleName(user.role?.name ?? "");
    setRoleError("");
    setSuccessMessage("");
    setShowRoleForm(true);
    setIsLoadingRoles(true);

    try {
      const response = await RoleService.getAllRoles();
      setRoles(response.data);
    } catch (error) {
      setRoleError(
        error.response?.data?.message || "Gagal mengambil daftar role.",
      );
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();

    if (!selectedRoleUser || !selectedRoleName) {
      setRoleError("Silakan pilih role terlebih dahulu.");
      return;
    }

    if (selectedRoleName === selectedRoleUser.role?.name) {
      setRoleError("User sudah memiliki role tersebut.");
      return;
    }

    setRoleError("");
    setSuccessMessage("");

    try {
      setIsAssigningRole(true);

      await UserService.assignRole(selectedRoleUser.id, selectedRoleName);

      setSuccessMessage("Role user berhasil diperbarui.");
      setShowRoleForm(false);
      setSelectedRoleUser(null);
      setSelectedRoleName("");

      await fetchUsers();
    } catch (error) {
      //   setRoleError(
      //     error.response?.data?.message || "Gagal mengubah role user.",
      //   );
      getErrorMessage(error, "Gagal mengubah role user");
    } finally {
      setIsAssigningRole(false);
    }
  };

  const handleCloseRoleForm = () => {
    if (isAssigningRole) return;

    setShowRoleForm(false);
    setSelectedRoleUser(null);
    setSelectedRoleName("");
    setRoleError("");
  };

  // Delete
  const handleDeleteUser = async (user) => {
    const isConfirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus akun ${user.username}?`,
    );

    if (!isConfirmed) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await UserService.deleteUser(user.id);

      setSuccessMessage(`Akun ${user.username} berhasil dihapus.`);

      await fetchUsers();
    } catch (error) {
      //   setErrorMessage(
      //     error.response?.data?.message || "Gagal menghapus akun pengguna.",
      //   );
      getErrorMessage(error, "Gagal menghapus akun pengguna");
    }
  };

  if (isLoading) return <p>Memuat data user...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div className="users-page">
      <div className="users-heading">
        <div>
          <h1>Manajemen User</h1>
          <p>Kelola informasi dan akun pengguna sistem</p>
        </div>

        {canCreateUser && (
          <button
            className="users-add-button"
            onClick={() => {
              setSuccessMessage("");
              setFormData("");
              setShowCreateForm(true);
            }}
          >
            <FiPlus />
            Tambah User
          </button>
        )}
      </div>

      {successMessage && <p className="users-success">{successMessage}</p>}
      {errorMessage && <p className="users-error">{errorMessage}</p>}

      <div className="users-toolbar">
        <div className="users-total">
          <span>Total User</span>
          <span>{users.length}</span>
          <input
            type="text"
            name="text"
            id="text"
            className="users-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Tanggal Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td className="users-username">{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-label">{user.role?.name || "-"}</span>
                  </td>
                  <td>
                    <span
                      className={`status-label ${user.isActive ? "active" : "inactive"}`}
                    >
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td>
                    <div className="users-action-buttons">
                      {canUpdateUser && (
                        <button
                          type="button"
                          className="users-edit-button"
                          onClick={() => handleOpenEditForm(user)}
                          title="Edit user"
                        >
                          <FiEdit2 />
                          Edit
                        </button>
                      )}
                      {canAssignRole &&
                        // user.id !== Number(userId) &&
                        // user.role?.name === "Super Admin" &&
                        user.id !== Number(currentUser?.id) &&
                        !(
                          currentUser?.role?.name === "Super Admin" &&
                          user?.role === "Admin"
                        ) && (
                          <button
                            type="button"
                            className="users-role-button"
                            onClick={() => handleOpenRoleForm(user)}
                            title="Ubah role"
                          >
                            <FiShield />
                            Ubah Role
                          </button>
                        )}
                      {canDeleteUser && user.id !== Number(currentUser?.id) && (
                        <button
                          type="button"
                          className="users-delete-button"
                          onClick={() => handleDeleteUser(user)}
                          title="Hapus pengguna"
                        >
                          <FiTrash2 />
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="users-empty">
                  {search ? "User tidak ditemukan" : "Belum ada data user"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="users-result">
        Menampilkan {filteredUsers.length} dari {users.length}
      </p>

      {showCreateForm && (
        <div className="users-modal-overlay">
          <div className="users-modal">
            <div className="users-modal-header">
              <div>
                <h2>Tambah Users</h2>
                <p>Masukkan informasi akun pengguna baru</p>
              </div>
              <button
                type="button"
                className="users-modal-close"
                onClick={handleCloseForm}
                disabled={isSubmitting}
                aria-label="Tutup form"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="users-form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan username"
                  required
                />
              </div>
              <div className="users-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email"
                  required
                />
              </div>
              <div className="users-form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimal 8 karakter"
                  minLength={8}
                  required
                />
              </div>

              <div className="users-form-note">
                User baru secara otomatis mendapatkan role user
              </div>

              {formError && <p className="users-form-error">{formError}</p>}
              <div className="users-form-actions">
                <button
                  type="button"
                  className="users-cancel-button"
                  onClick={handleCloseForm}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="users-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="users-modal-overlay">
          <div className="users-modal">
            <div className="users-modal-header">
              <div>
                <h2>Edit Informasi User</h2>
                <p>Perbarui informasi akun pengguna.</p>
              </div>

              <button
                type="button"
                className="users-modal-close"
                onClick={handleCloseEditForm}
                disabled={isUpdating}
                aria-label="Tutup form"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleUpdateUser}>
              <div className="users-form-group">
                <label htmlFor="edit-username">Username</label>
                <input
                  id="edit-username"
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="users-form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="users-form-group">
                <label>Status Akun</label>

                <label className="users-status-toggle">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editData.isActive}
                    onChange={handleEditInputChange}
                  />

                  <span>{editData.isActive ? "Aktif" : "Nonaktif"}</span>
                </label>
              </div>

              <div className="users-form-note">
                Perubahan role dan password dilakukan melalui fitur terpisah.
              </div>

              {editError && <p className="users-form-error">{editError}</p>}

              <div className="users-form-actions">
                <button
                  type="button"
                  className="users-cancel-button"
                  onClick={handleCloseEditForm}
                  disabled={isUpdating}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="users-submit-button"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRoleForm && (
        <div className="users-modal-overlay">
          <div className="users-modal">
            <div className="users-modal-header">
              <div>
                <h2>Ubah Role User</h2>
                <p>Pilih role baru untuk {selectedRoleUser?.username}.</p>
              </div>

              <button
                type="button"
                className="users-modal-close"
                onClick={handleCloseRoleForm}
                disabled={isAssigningRole}
                aria-label="Tutup form"
              >
                <FiX />
              </button>
            </div>

            {isLoadingRoles ? (
              <p className="users-status">Memuat daftar role...</p>
            ) : (
              <form onSubmit={handleAssignRole}>
                <div className="users-form-group">
                  <label>Role Saat Ini</label>
                  <input
                    type="text"
                    value={selectedRoleUser?.role?.name || "-"}
                    disabled
                  />
                </div>

                <div className="users-form-group">
                  <label htmlFor="selected-role">Role Baru</label>
                  <select
                    id="selected-role"
                    value={selectedRoleName}
                    onChange={(e) => setSelectedRoleName(e.target.value)}
                    required
                  >
                    <option value="">Pilih Role</option>
                    {roles
                      .filter(
                        (role) =>
                          currentUser?.role === "Super Admin" ||
                          role.name !== "Super Admin",
                      )
                      .map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="users-form-note">
                  Perubahan role akan memengaruhi hak akses user setelah
                  perubahan berhasil disimpan
                </div>

                {roleError && <p className="users-form-error">{roleError}</p>}

                <div className="users-form-actions">
                  <button
                    type="button"
                    className="users-cancel-button"
                    onClick={handleCloseRoleForm}
                    disabled={isAssigningRole}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="users-submit-button"
                    disabled={isAssigningRole}
                  >
                    {isAssigningRole ? "Menyimpan..." : "Simpan Role"}
                  </button>
                </div>
              </form>
            )}

            {!isLoadingRoles && roleError && !roles.length && (
              <p className="users-form-error">{roleError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
