// backend/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// MEMBER SIGNUP

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: "Member",
      isApproved: false,
    });

    res.json({
      message: "Signup request sent. Wait for admin approval.",
    });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// LOGIN

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // 🔥 BLOCK IF NOT APPROVED
    if (!user.isApproved) {
      return res.status(403).json({ message: "Account not approved by admin" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      token: generateToken(user._id, user.role),
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET PENDING USERS

export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// APPROVE USER

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = true;
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//GET APPROVED MEMBERS

export const getApprovedUsers = async (req, res) => {
  try {
    const users = await User.find({
      isApproved: true,
      role: "Member",
    }).select("_id name email");

    res.json(users);
  } catch (err) {
    console.log("GET APPROVED USERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
