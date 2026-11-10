import { useEffect, useState } from "react";
import RoleService from "../../services/roleService.js";
import { useAuth } from "../../context/AuthContext";
import PermissionService from "../../services/permissionService.js";
import { getErrorMessage } from "../../utils/errorHandler.js";

function Roles() {
  const { hasPermission } = useAuth();
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const canManagePermissions = hasPermission("role.manage_permissions");

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await RoleService.getAllRoles();
      setRoles(response.data);
    } catch (error) {
      //   setErrorMessage(
      //     error.response?.data?.message || "Gagal mengambil data role.",
      //   );
      setErrorMessage(getErrorMessage(error, "Gagal mengambil data role"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenPermissionModal = async (role) => {
    if (role.name === "Super Admin") return;

    setSelectedRole(role);
    setSelectedPermissionIds(
      role.permissions.map((permission) => permission.id),
    );

    setPermissionError("");
    setSuccessMessage("");
    setShowPermissionModal(true);
    setIsLoadingPermissions(true);

    try {
      const response = await PermissionService.getAllPermissions();
      setPermissions(response.data);
    } catch (error) {
      //   setPermissionError(
      //     error.response?.data?.message || "Gagal mengambil daftar permission.",
      //   );
      setErrorMessage(
        getErrorMessage(error, "Gagal mengambil data permission"),
      );
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissionIds((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      }

      return [...prev, permissionId];
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    setPermissionError("");
    setSuccessMessage("");

    try {
      setIsSavingPermissions(true);

      await RoleService.updateRolePermissions(
        selectedRole.id,
        selectedPermissionIds,
      );

      setSuccessMessage(
        `Permission untuk role ${selectedRole.name} berhasil diperbarui.`,
      );

      setShowPermissionModal(false);
      setSelectedRole(null);
      setSelectedPermissionIds([]);

      await fetchRoles();
    } catch (error) {
      //   setPermissionError(
      //     error.response?.data?.message || "Gagal memperbarui permission.",
      //     );
      setErrorMessage(getErrorMessage(error, "Gagal memperbarui permission"));
    } finally {
      setIsSavingPermissions(false);
    }
  };

  if (isLoading) {
    return <p>Memuat data role...</p>;
  }

  if (errorMessage) {
    return <p className="roles-error">{errorMessage}</p>;
  }

  return (
    <div className="roles-page">
      <div className="roles-header">
        <div>
          <h1>Manajemen Role</h1>
          <p>Kelola role dan lihat hak akses yang dimiliki setiap role</p>
        </div>
      </div>

      {successMessage && <p className="users-success">{successMessage}</p>}

      <div className="roles-grid">
        {roles.map((role) => (
          <div className="role-card" key={role.id}>
            <div className="role-card-header">
              <h2>{role.name}</h2>
              <span>{role.permissions?.length || 0} Permissions</span>
            </div>

            <p className="role-description">
              {role.description || "Tidak ada deskripsi."}
            </p>

            <div className="role-permissions">
              <h3>Daftar Permission</h3>

              {role.permissions?.length > 0 ? (
                <ul>
                  {role.permissions.map((permission) => (
                    <li key={permission.id}>{permission.name}</li>
                  ))}
                </ul>
              ) : (
                <p>Belum memiliki permission</p>
              )}
            </div>

            {canManagePermissions && role.name !== "Super Admin" && (
              <button
                type="button"
                className="role-edit-button"
                onClick={() => handleOpenPermissionModal(role)}
              >
                Edit Permissions
              </button>
            )}
          </div>
        ))}
      </div>

      {showPermissionModal && (
        <div className="role-modal-overlay">
          <div className="role-modal">
            <div className="role-modal-header">
              <div>
                <h2>Edit Permissions</h2>
                <p>Role: {selectedRole?.name}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPermissionModal(false);
                  setSelectedRole(null);
                  setPermissionError("");
                }}
                disabled={isSavingPermissions}
              >
                &times;
              </button>
            </div>

            {permissionError && (
              <p className="roles-error">{permissionError}</p>
            )}

            {isLoadingPermissions ? (
              <p>Memuat daftar permission...</p>
            ) : (
              <div className="permission-list">
                {permissions.map((permission) => (
                  <label className="permission-item" key={permission.id}>
                    <input
                      type="checkbox"
                      checked={selectedPermissionIds.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                    />

                    <div>
                      <strong>{permission.name}</strong>
                      <p>{permission.description || "Tidak ada deskripsi."}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="role-modal-actions">
              <button
                type="button"
                className="role-cancel-button"
                onClick={() => {
                  setShowPermissionModal(false);
                  setSelectedRole(null);
                  setPermissionError("");
                }}
                disabled={isSavingPermissions}
              >
                Batal
              </button>

              <button
                type="button"
                className="role-save-button"
                onClick={handleSavePermissions}
                disabled={isSavingPermissions || isLoadingPermissions}
              >
                {isSavingPermissions ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roles;
