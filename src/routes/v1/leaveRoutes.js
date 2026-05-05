import express from "express";
import { abac } from "../../middleware/abac.js";
import { auth } from "../../middleware/auth.js";
import { createLeavePolicy, deleteLeavePolicy, getLeavePolicy, updateLeavePolicy } from "../../controllers/leaveController.js";

const router = express.Router();

router.post(
    "/policy",
    auth,
    abac("leave:create", { allowedRoles: ["admin", "hr_admin"] }),
    createLeavePolicy
);
router.get(
    "/policy",
    auth,
    abac("leave:read", { allowedRoles: ["admin", "hr_admin", "employee"] }),
    getLeavePolicy
)
router.patch(
    "/policy/:id",
    auth,
    abac("leave:update", { allowedRoles: ["admin", "hr_admin"] }),
    updateLeavePolicy
)
router.patch(
    "/policy/:id/delete",
    auth,
    abac("leave:delete", { allowedRoles: ["admin", "hr_admin"] }),
    deleteLeavePolicy
)

export default router;