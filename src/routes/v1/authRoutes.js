import express from "express";
import {
  login,
  register,
  getMe,
  refreshToken,
} from "../../controllers/authController.js";
import { auth } from "../../middleware/auth.js";
import tenantMiddleware from "../../middleware/tenant.js";

const router = express.Router();

// Public login route — tenantMiddleware identifies tenant from header or email lookup
router.post("/login", tenantMiddleware, login);
router.post("/register", register);
router.get("/refresh-token", auth, refreshToken);

// Protected routes
router.get("/me", auth, getMe);

export default router;
