import { useEffect, useState } from "react";
import PermissionService from "../../services/permissionService.js";
import { getErrorMessage } from "../../utils/errorHandler.js";

function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await PermissionService.getAllPermissions();
      setPermissions(response.data);
    } catch (error) {
      //   setErrorMessage(
      //     error.response?.data?.message || "Gagal mengambil data permission.",
      //   );
      setErrorMessage(
        getErrorMessage(error, "Gagal mengambil data permission"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  if (isLoading) {
    return <p>Memuat data permission...</p>;
  }

  if (errorMessage) {
    return <p className="permissions-error">{errorMessage}</p>;
  }

  return (
    <div className="permissions-page">
      <div className="permissions-header">
        <div>
          <h1>Manajemen Permission</h1>
          <p>Lihat seluruh hak akses yang tersedia dalam sistem.</p>
        </div>

        <div className="permissions-total">
          <span>Total Permission</span>
          <strong>{permissions.length}</strong>
        </div>
      </div>

      <div className="permissions-table-container">
        <table className="permissions-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Permission</th>
              <th>Deskripsi</th>
            </tr>
          </thead>

          <tbody>
            {permissions.length > 0 ? (
              permissions.map((permission, index) => (
                <tr key={permission.id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="permission-name">{permission.name}</span>
                  </td>
                  <td>{permission.description || "Tidak ada deskripsi."}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="permissions-empty">
                  Belum ada data permission.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Permissions;
