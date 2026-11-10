import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ProfileService from "../../services/profileService.js";
import { getErrorMessage } from "../../utils/errorHandler.js";

function Profile() {
  const { user, hasPermission, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const canUpdateProfile = hasPermission("profile.update");

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await ProfileService.getMyProfile();
      const data = response.data;

      setProfile(data);
      setFormData({
        username: data.username,
        email: data.email,
      });
    } catch (error) {
      //   setErrorMessage(
      //     error.response?.data?.message || "Gagal mengambil data profil.",
      //   );
      setErrorMessage(getErrorMessage(error, "Gagal mengambil data profil"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Edit
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsSaving(true);

      await ProfileService.updateMyProfile(formData);
      await refreshUser();

      setSuccessMessage("Profil berhasil diperbarui.");
      setIsEditing(false);

      await fetchProfile();
    } catch (error) {
      //   setErrorMessage(
      //     error.response?.data?.message || "Gagal memperbarui profil.",
      //   );
      setErrorMessage(getErrorMessage(error, "Gagal mengambil data profil"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      username: profile.username,
      email: profile.email,
    });

    setIsEditing(false);
    setErrorMessage("");
  };

  // Change password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("Konfirmasi password baru tidak sesuai.");
      return;
    }

    try {
      setIsChangingPassword(true);

      await ProfileService.changePassword(passwordData);

      setSuccessMessage("Password berhasil diperbarui.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);
    } catch (error) {
      //   setErrorMessage(
      //     error.response?.data?.message || "Gagal mengubah password.",
      //   );
      setErrorMessage(getErrorMessage(error, "Gagal mengubah password"));
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return <p>Memuat profil...</p>;
  }

  if (!profile) {
    return (
      <p className="profile-error">
        {errorMessage || "Data profil tidak ditemukan."}
      </p>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profil Saya</h1>
        <p>Kelola informasi akun dan keamanan password.</p>
      </div>

      {errorMessage && <p className="profile-error">{errorMessage}</p>}
      {successMessage && <p className="profile-success">{successMessage}</p>}

      <div className="profile-card">
        <div className="profile-card-header">
          <div>
            <h2>Informasi Profil</h2>
            <p>Informasi dasar akun pengguna.</p>
          </div>

          {canUpdateProfile && !isEditing && (
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit Profil
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="profile-form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-actions">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Batal
              </button>

              <button type="submit" disabled={isSaving}>
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-information">
            <div>
              <span>Username</span>
              <strong>{profile.username}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{profile.email}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>{profile.role?.name || user?.role}</strong>
            </div>

            <div>
              <span>Status Akun</span>
              <strong>{profile.isActive ? "Aktif" : "Tidak Aktif"}</strong>
            </div>
          </div>
        )}
      </div>

      <div className="profile-card password-card">
        <div className="profile-card-header">
          <div>
            <h2>Keamanan Akun</h2>
            <p>Perbarui password untuk menjaga keamanan akun.</p>
          </div>

          {canUpdateProfile && !showPasswordForm && (
            <button
              type="button"
              onClick={() => {
                setShowPasswordForm(true);
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              Ubah Password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword}>
            <div className="profile-form-group">
              <label htmlFor="currentPassword">Password Lama</label>

              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="newPassword">Password Baru</label>

              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                minLength={8}
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                minLength={8}
                required
              />
            </div>

            <div className="profile-actions">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setErrorMessage("");
                }}
                disabled={isChangingPassword}
              >
                Batal
              </button>

              <button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? "Memproses..." : "Simpan Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
