import express from "express";

import {
  createDesignation,
  getAllDesignations,
  getDesignationById,
} from "../../controllers/designationController.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();
router.get("/", auth, getAllDesignations);
router.post("/", auth, createDesignation);
router.get("/:id", auth, getDesignationById);

export default router;
