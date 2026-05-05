import express from "express";
import authRoutes from "./authRoutes.js";
import tenantRoutes from "./tenantRoutes.js";
import userRoutes from "./userRoutes.js";
import roleRoutes from "./roleRoutes.js";
import employeeRoutes from "./employeeRoutes.js";
import departmentsRoutes from "./departmentsRoutes.js";
import designationRoutes from "./designationRoutes.js";
import leaveRoutes from "./leaveRoutes.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tenants", tenantRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentsRoutes);
router.use("/designations", designationRoutes);
router.use("/leave", leaveRoutes)

export default router;
