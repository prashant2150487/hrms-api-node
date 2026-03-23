import express from 'express';
import { login, register } from '../../controllers/authController.js';
import tenantMiddleware from '../../middleware/tenat.js';

const router = express.Router();

// Public login route (uses tenantMiddleware to identify tenant from headers/body)
// router.post('/login', tenantMiddleware, login);
router.post('/register', register);
router.post("/login", login)

export default router;
