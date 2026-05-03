import express from "express";

import {
  createDesignation,
  deleteDesignation,
  getAllDesignations,
  getDesignationById,
  updateDesignation,
} from "../../controllers/designationController.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();
router.get("/", auth, getAllDesignations);
router.post("/", auth, createDesignation);
router.get("/:id", auth, getDesignationById);
router.patch("/:id", auth, updateDesignation);
router.patch("/delete/:id", auth, deleteDesignation);

export default router;
