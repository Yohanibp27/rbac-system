export const validateRequired = (value, fieldName) => {
  if (!value || !value.trim()) {
    return `${fieldName} wajib diisi.`;
  }

  return "";
};

export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return "Format email tidak valid.";
  }

  return "";
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return "Password minimal 8 karakter.";
  }

  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Konfirmasi password tidak sesuai.";
  }

  return "";
};
