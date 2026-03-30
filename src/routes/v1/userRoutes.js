import express from "express";
import { getAllUsers } from "../../controllers/userController.js";
import { auth } from "../../middleware/auth.js";



const router = express.Router();
router.get("", auth, getAllUsers)



export default router;
