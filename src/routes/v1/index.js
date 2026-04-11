import express from 'express';
import authRoutes from './authRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import userRoutes from "./userRoutes.js"
import roleRoutes from './roleRoutes.js';
import employeeRoutes from './employeeRoutes.js';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes)
router.use('/users', userRoutes)
router.use('/roles', roleRoutes)
router.use('/employees', employeeRoutes)


export default router;
