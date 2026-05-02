import express from "express";
import {
  createProject,
  getProjects,
  addMember,
  getProjectMembers,
  removeMember,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", protect, isAdmin, createProject);

// GET PROJECTS
router.get("/", protect, getProjects);

// ADD MEMBER
router.post("/:id/add-member", protect, isAdmin, addMember);

// GET MEMBERS
router.get("/:id/members", protect, isAdmin, getProjectMembers);

// REMOVE MEMBER
router.put("/:id/remove-member", protect, isAdmin, removeMember);

export default router;
