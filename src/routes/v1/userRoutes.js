import express from "express";
import { getAllUsers } from "../../controllers/userController.js";
import { abac } from "../../middleware/abac.js";
import { auth } from "../../middleware/auth.js";


const router = express.Router();
router.get("", auth , abac('employees:view'), getAllUsers)


export default router;
