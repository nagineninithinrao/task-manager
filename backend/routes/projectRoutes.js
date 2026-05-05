import express from "express";
import {
  createProject,
  getProjects,
  addMember,
  removeMember,
  getProjectMembers,
  deleteProject,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isAdmin, createProject)
  .get(protect, getProjects);
router.get("/:id/members", protect, getProjectMembers);
router.post("/:id/add-member", protect, isAdmin, addMember);
router.put("/:id/remove-member", protect, isAdmin, removeMember);
router.delete("/:id", protect, isAdmin, deleteProject);

export default router;
