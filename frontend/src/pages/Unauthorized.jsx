import React from "react";

function Unauthorized() {
  return (
    <div>
      <h1>403 - Access Denied</h1>

      <p>Maaf, kamu tidak memiliki izin untuk mengakses halaman ini.</p>

      <Link to="/dashboard">Kembali ke Dashboard</Link>
    </div>
  );
}

export default Unauthorized;
