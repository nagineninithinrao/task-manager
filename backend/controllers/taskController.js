import Task from "../models/Task.js";

/**
 * =========================
 * CREATE TASK (ADMIN ONLY)
 * =========================
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    if (!title || !assignedTo) {
      return res
        .status(400)
        .json({ message: "Title and assigned user required" });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      dueDate,
    });

    res.json(task);
  } catch (err) {
    console.log("CREATE TASK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * GET TASKS (ROLE BASED)
 * =========================
 */
export const getTasks = async (req, res) => {
  try {
    let tasks;

    // 👑 ADMIN → see all tasks in project
    if (req.user.role === "Admin") {
      tasks = await Task.find({
        projectId: req.params.projectId,
      }).populate("assignedTo", "name email");
    }
    // 👤 MEMBER → see only assigned tasks
    else {
      tasks = await Task.find({
        projectId: req.params.projectId,
        assignedTo: req.user.id,
      });
    }

    res.json(tasks);
  } catch (err) {
    console.log("GET TASKS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * UPDATE TASK STATUS (MEMBER)
 * =========================
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    console.log("UPDATE TASK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * 🔥 GET TASKS BY USER (ADMIN)
 * =========================
 */
export const getTasksByUser = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.params.userId,
    });

    res.json(tasks);
  } catch (err) {
    console.log("GET TASKS BY USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
