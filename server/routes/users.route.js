import { Router } from 'express';
import { 
  loginUser, 
  logoutUser, 
  registerUser, 
  resendVerificationEmail, 
  verifyUserEmail,
  forgotPassword, // Yeni eklendi
  resetPassword   // Yeni eklendi
} from '../controllers/users.controller.js';
import { authMiddleware } from '../middleware/authentication.js';

const router = Router();

// --- Auth Routes ---

// Login route
router.post("/login", loginUser);

// Logout route
router.delete("/logout", authMiddleware, logoutUser);

// Register route
router.post("/new/user", registerUser);

// --- Email Verification ---

// Email verification (Linke tıklandığında)
router.get("/verify/:id/:token", verifyUserEmail);

// Resend verification
router.post("/resend/verification", resendVerificationEmail);

// --- Password Reset (Şifre Sıfırlama) ---

// Şifremi unuttum talebi (E-posta gönderir)
router.post("/forgot-password", forgotPassword);

// Yeni şifreyi kaydetme (Token URL'den gelir)
router.post("/reset-password/:token", resetPassword);


// // edit user route
// router.put("/edit/user", authMiddleware, )

// // delete user route
// router.delete("/delete/user", authMiddleware, )

export default router;