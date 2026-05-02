import express from "express";
import { auth } from "../../middleware/auth.js";
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from "../../controllers/departmentController.js";



const router = express.Router();
router.get("", auth, getDepartments);
router.post("", auth, createDepartment)
router.patch("/:id", auth, updateDepartment);
router.delete("/:id", auth, deleteDepartment);
export default router;