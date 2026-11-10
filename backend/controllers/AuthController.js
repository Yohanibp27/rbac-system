import AuthService from "../services/AuthService.js";

const register = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);

    return res.status(201).json({
      message: "Registrasi berhasil.",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);

    return res.status(200).json({
      message: "Login berhasil.",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  //   return res.status(200).json({
  //     message: "Autentikasi berhasil.",
  //     data: {
  //       id: req.user.id,
  //       email: req.user.email,
  //       role: req.user.role,
  //     },
  //   });

  try {
    const user = await AuthService.getCurrentUser(req.user.id);

    return res.status(200).json({
      message: "Data pengguna berhasil diambil.",
      data: user,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

export default {
  register,
  login,
  getMe,
};
