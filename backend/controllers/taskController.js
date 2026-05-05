import Task from "../models/Task.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, assignedTo, duration, projectId } = req.body;

    if (!title || !assignedTo || !duration || !projectId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const task = await Task.create({
      title,
      assignedTo,
      duration: Number(duration),
      projectId,
    });

    res.json(task);
  } catch (err) {
    console.log("CREATE TASK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

//GET ALL TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MEMBER TASKS
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS
export const updateTaskStatus = async (req, res) => {
  try {
    const { submissionLink } = req.body;

    if (!submissionLink && !req.file) {
      return res.status(400).json({
        message: "Submission link or file required",
      });
    }

    const updateData = {
      status: "Done",
    };

    if (submissionLink) updateData.submissionLink = submissionLink;
    if (req.file) updateData.submissionFile = req.file.path;

    const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(task);
  } catch (err) {
    console.log("STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const { title, duration } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Not found" });

    if (title) task.title = title;
    if (duration) task.duration = Number(duration);

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

// ADMIN VIEW USER TASKS
export const getTasksByUser = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.params.userId });
  res.json(tasks);
};

// PROJECT TASKS
export const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({
    projectId: req.params.projectId,
  }).populate("assignedTo", "name email");

  res.json(tasks);
};
