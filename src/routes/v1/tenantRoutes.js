import express from "express"
import { deleteTenant, getAllTenants, getTenantById, updateTenant } from "../../controllers/tenantsController.js";
import { auth } from "../../middleware/auth.js";
import { abac } from "../../middleware/abac.js";
import tenantMiddleware from "../../middleware/tenant.js";


const router = express.Router();

router.get('', auth, getAllTenants);
router.get('/:id', auth, abac('system_config:manage'), getTenantById);
router.patch("/:id", auth, abac('system_config:manage'), updateTenant);
router.delete("/:id", auth, abac('system_config:manage'), deleteTenant);


export default router