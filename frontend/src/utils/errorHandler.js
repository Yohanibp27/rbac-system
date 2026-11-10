export const getErrorMessage = (
  error,
  fallbackMessage = "Terjadi kesalahan. Silakan coba kembali",
) => {
  if (error.response) {
    return error.response.data?.message || fallbackMessage;
  }

  if (error.request) {
    return "Tidak dapat terhubung ke server. Periksa koneksi dan pastikan backend berjalan";
  }

  return error.message || fallbackMessage;
};
