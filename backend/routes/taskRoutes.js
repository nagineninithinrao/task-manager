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
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, createTask);

router.get("/", protect, getTasks);
router.get("/my", protect, getMyTasks);
router.get("/user/:userId", protect, getTasksByUser);
router.get("/project/:projectId", protect, getTasksByProject);

router.put("/:id/status", protect, upload.single("file"), updateTaskStatus);

router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;
