import {Router} from 'express';
import { loginUser, logoutUser, registerUser, resendVerificationEmail, verifyUserEmail } from '../controllers/users.controller.js';
import { authMiddleware } from '../middleware/authentication.js';

const router = Router();

// login route
router.post("/login", loginUser)

// logout route
router.delete("/logout", authMiddleware, logoutUser)

// register route
router.post("/new/user", registerUser)

// // edit user route
// router.put("/edit/user", authMiddleware, )

// // delete user route
// router.delete("/delete/user", authMiddleware, )

// email verification
router.get("/verify/:id/:token", verifyUserEmail);

// resend verification
router.post("/resend/verification", resendVerificationEmail);


export default router;