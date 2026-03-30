import express from "express"
import { deleteTenant, getAllTenants, getTenantById, updateTenant } from "../../controllers/tenantsController.js";
import { auth } from "../../middleware/auth.js";


const router = express.Router();

router.get('', auth, getAllTenants);
router.get('/:id', auth, getTenantById);
router.patch("/:id", auth, updateTenant);
router.delete("/:id", auth, deleteTenant);


export default router