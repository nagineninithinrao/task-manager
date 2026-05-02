// backend/routes/authRoutes.js
import express from "express";
import {
  signup,
  login,
  getPendingUsers,
  approveUser,
  getApprovedUsers, // ✅ NEW
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// =====================
// AUTH
// =====================
router.post("/signup", signup);
router.post("/login", login);

// =====================
// ADMIN ROUTES
// =====================
router.get("/pending", protect, isAdmin, getPendingUsers);
router.put("/approve/:id", protect, isAdmin, approveUser);

// 🔥 NEW ROUTE (FOR TASK ASSIGNMENT)
router.get("/approved", protect, isAdmin, getApprovedUsers);

export default router;
