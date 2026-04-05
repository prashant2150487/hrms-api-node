import express from "express";
import { getAllUsers, createUser, getUserDetails, updateUserDetails, deactivateUser } from "../../controllers/userController.js";
import { auth } from "../../middleware/auth.js";
import { abac } from "../../middleware/abac.js";


const router = express.Router();
router.get("", auth, getAllUsers)
router.post("/", auth, abac('users:create', { allowedRoles: ['admin', 'hr_admin'] }), createUser)
router.get("/:id", auth, abac('users:read', { allowedRoles: ['admin', 'hr_admin'] }), getUserDetails)
router.patch("/:id", auth, abac('users:update', { allowedRoles: ['admin', 'hr_admin'] }), updateUserDetails)
router.patch("/:id/deactivate", auth, abac('users:update', { allowedRoles: ['admin', 'hr_admin'] }), deactivateUser)
export default router;
