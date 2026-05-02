import Task from "../models/Task.js";

/**
 * CREATE TASK (ADMIN)
 */
export const createTask = async (req, res) => {
  try {
    const { title, assignedTo, duration, projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Project required" });
    }

    const task = await Task.create({
      title,
      assignedTo,
      duration,
      projectId, // 🔥 CONNECTED
    });

    res.json(task);
  } catch (err) {
    console.log("CREATE TASK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN → VIEW USER TASKS
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const status = req.body?.status || "Done";
    const submissionLink = req.body?.submissionLink;

    const updateData = {
      status,
    };

    if (submissionLink) {
      updateData.submissionLink = submissionLink;
    }

    if (req.file) {
      updateData.submissionFile = req.file.path;
    }

    // 🔥 IMPORTANT: use findByIdAndUpdate (NO full validation)
    const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.log("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
/**
 * ADMIN → GET ALL TASKS (FOR DASHBOARD)
 */
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    console.log("GET ALL TASKS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.id,
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//task update by admin
// ✏️ UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const { title, duration } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title) task.title = title;

    if (duration) {
      task.duration = Number(duration);

      const now = new Date();
      task.dueDate = new Date(
        now.getTime() + task.duration * 24 * 60 * 60 * 1000,
      );
    }

    await task.save();

    res.json(task);
  } catch (err) {
    console.log("UPDATE TASK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🗑 DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.log("DELETE TASK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getTasksByUser = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.params.userId,
    });

    res.json(tasks);
  } catch (err) {
    console.log("GET USER TASKS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectId,
    }).populate("assignedTo", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
