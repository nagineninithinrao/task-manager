import express from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  getTasksByUser,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * ADMIN → create task
 */
router.post("/", protect, isAdmin, createTask);

/**
 * BOTH → get tasks (role-based filtering)
 */
router.get("/:projectId", protect, getTasks);

/**
 * MEMBER → update status
 */
router.put("/:id/status", protect, updateTaskStatus);

/**
 * 🔥 ADMIN → view tasks of specific user
 */
router.get("/user/:userId", protect, isAdmin, getTasksByUser);

export default router;
