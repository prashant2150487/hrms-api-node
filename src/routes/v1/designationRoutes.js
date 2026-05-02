import express from "express";

import { getAllDesignations } from "../../controllers/designationController.js";
import { auth } from "../../middleware/auth.js";





const router = express.Router();
router.get("/", auth, getAllDesignations);





export default router;

