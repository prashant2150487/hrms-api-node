import express from "express";
import { getAllEmployees, getEmployeeById, updateEmployeeById } from "../../controllers/employeeController.js";
import { auth } from "../../middleware/auth.js";
import { abac } from "../../middleware/abac.js";


const router = express.Router();

router.get("/", auth, abac("employees:read", { allowedRoles: ["admin", "hr_admin", "manager"] }), getAllEmployees)
router.get("/:id", auth, abac("employees:read", { allowedRoles: ["admin", "hr_admin", "manager"] }), getEmployeeById)
router.patch("/:id", auth, abac("employees:update", { allowedRoles: ["admin", "hr_admin"] }), updateEmployeeById)

export default router