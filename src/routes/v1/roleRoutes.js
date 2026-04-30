import express from "express"
import { createCustomRole, getAllPermissions, getAllRoles, getPermissionOnRole, setPermissionOnRole } from "../../controllers/roleController.js"
import { auth } from "../../middleware/auth.js"
import { abac } from "../../middleware/abac.js"




const router = express.Router()

router.get("/", auth, abac("roles:read", { allowedRoles: ["admin", "hr_admin"] }), getAllRoles)
router.post("/", auth, abac("roles:create", { allowedRoles: ["super_admin"] }), createCustomRole)
router.get("/:role_id/permission", auth, abac("roles:read", { allowedRoles: ["admin", "hr_admin"] }), getPermissionOnRole)
router.get("/permission", auth, abac("role:read", { allowedRoles: ["admin", "hr_admin", "super_admin"] }), getAllPermissions)
router.patch("/:role_id/permission", auth, abac("roles:update", { allowedRoles: ["admin", "hr_admin"] }), setPermissionOnRole)


export default router
