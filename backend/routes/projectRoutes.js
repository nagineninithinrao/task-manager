import express from "express";
import {
  createProject,
  getProjects,
  addMember,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createProject);
router.get("/", protect, getProjects);
router.post("/:id/add-member", protect, isAdmin, addMember);

export default router;
