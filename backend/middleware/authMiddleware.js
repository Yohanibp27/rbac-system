import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    // 1. Mengambil token dari Authorization Header
    const authHeader = req.headers.authorization;

    // 2. Memeriksa keberadaan token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token tidak ditemukan.",
      });
    }

    // 3. Mengambil token tanpa prefix Bearer
    const token = authHeader.split(" ")[1];

    // 4. Memverifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Menyimpan identitas pengguna ke request
    req.user = decoded;

    // 6. Melanjutkan request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token sudah kedaluwarsa.",
      });
    }

    return res.status(401).json({
      message: "Token tidak valid.",
    });
  }
};

export default authenticateToken;
