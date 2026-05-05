import express from "express";
import {
  createTask,
  getTasks,
  getMyTasks,
  getTasksByUser,
  getTasksByProject,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ADMIN ONLY CREATE
router.post("/", protect, isAdmin, createTask);

// GET
router.get("/", protect, isAdmin, getTasks);
router.get("/my", protect, getMyTasks);
router.get("/user/:userId", protect, isAdmin, getTasksByUser);
router.get("/project/:projectId", protect, getTasksByProject);

// SUBMIT TASK
router.put("/:id/status", protect, upload.single("file"), updateTaskStatus);

// EDIT / DELETE
router.put("/:id", protect, isAdmin, updateTask);
router.delete("/:id", protect, isAdmin, deleteTask);

export default router;
