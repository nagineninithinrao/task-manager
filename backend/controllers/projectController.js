import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  const { title, description } = req.body;

  const project = await Project.create({
    title,
    description,
    createdBy: req.user.id,
    members: [req.user.id],
  });

  res.json(project);
};

export const getProjects = async (req, res) => {
  const projects = await Project.find({
    members: req.user.id,
  }).populate("members", "name email");

  res.json(projects);
};

export const addMember = async (req, res) => {
  const { userId } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project.members.includes(userId)) {
    project.members.push(userId);
    await project.save();
  }

  res.json(project);
};
