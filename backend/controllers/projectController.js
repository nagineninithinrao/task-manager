import Project from "../models/Project.js";
import User from "../models/User.js";

// =====================
// CREATE PROJECT
// =====================
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// GET PROJECTS
// =====================
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    }).populate("members", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// ADD MEMBER (ADMIN)
// =====================
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// GET PROJECT MEMBERS
// =====================
export const getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members",
      "name email role",
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project.members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// REMOVE MEMBER (ADMIN)
// =====================
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ❌ prevent removing admin/creator
    if (userId === project.createdBy.toString()) {
      return res.status(400).json({
        message: "Cannot remove project owner",
      });
    }

    project.members = project.members.filter((m) => m.toString() !== userId);

    await project.save();

    res.json({ message: "Member removed" });
  } catch (err) {
    console.log("REMOVE MEMBER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
