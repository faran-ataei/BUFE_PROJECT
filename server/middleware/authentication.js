import jwt from "jsonwebtoken";
import tokenBlacklist from "../utils/blackList.js";


export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Belirteç sağlanmadı" });
    }

    if (tokenBlacklist.has(token)) {
      return res.status(403).json({ message: "Belirteç geçersiz (logout edilmiş)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Geçersiz veya süresi dolmuş belirteç" });
  }
};