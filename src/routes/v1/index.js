import express from 'express';
import authRoutes from './authRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import userRoutes from "./userRoutes.js"
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes)
router.use('/users', userRoutes)


export default router;
