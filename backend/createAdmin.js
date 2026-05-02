import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await User.findOne({ email: "admin@gmail.com" });
  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: hashed,
    role: "Admin",
    isApproved: true,
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();
