import express from "express"
import { deleteTenant, getAllTenants, getTenantById, updateTenant } from "../../controllers/tenantsController.js";
import { auth } from "../../middleware/auth.js";
import { abac } from "../../middleware/abac.js";
import tenantMiddleware from "../../middleware/tenant.js";


const router = express.Router();

router.get('', auth, abac('system_config:manage'), getAllTenants);
router.get('/:id', tenantMiddleware, auth, abac('system_config:manage'), getTenantById);
router.patch("/:id", tenantMiddleware, auth, abac('system_config:manage'), updateTenant);
router.delete("/:id", tenantMiddleware, auth, abac('system_config:manage'), deleteTenant);


export default router