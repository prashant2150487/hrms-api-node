import express from "express";
import { getAllEmployees } from "../../controllers/employeeController.js";
import { auth } from "../../middleware/auth.js";
import { abac } from "../../middleware/abac.js";


const router = express.Router();

router.get("/", auth, abac("employees:read", { allowedRoles: ["admin", "hr_admin", "manager"] }), getAllEmployees)

export default router