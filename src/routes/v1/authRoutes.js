import express from 'express';
import { login, register, getMe } from '../../controllers/authController.js';
import { auth } from '../../middleware/auth.js';
import tenantMiddleware from '../../middleware/tenant.js';
import { getAllTenants } from '../../controllers/tenantsController.js';
import { rbac } from '../../middleware/rbac.js';

const router = express.Router();

// Public login route (uses tenantMiddleware to identify tenant from headers/body)
router.post("/login", tenantMiddleware, login)
router.post('/register', register);

// Protected routes
router.get('/me', auth, getMe);
router.get('/tenants', auth, getAllTenants);

export default router;
