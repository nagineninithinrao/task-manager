import express from "express";
import {
  signup,
  login,
  getPendingUsers,
  approveUser,
  getApprovedUsers,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/pending", protect, isAdmin, getPendingUsers);
router.put("/approve/:id", protect, isAdmin, approveUser);

router.get("/approved", protect, isAdmin, getApprovedUsers);

export default router;
