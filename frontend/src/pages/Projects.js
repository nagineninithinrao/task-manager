import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [members, setMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [userId, setUserId] = useState("");

  const nav = useNavigate();

  // =====================
  // FETCH PROJECTS
  // =====================
  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =====================
  // CREATE PROJECT
  // =====================
  const createProject = async () => {
    if (!title) return alert("Enter title");

    try {
      await API.post("/projects", {
        title,
        description,
      });

      setTitle("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  // =====================
  // VIEW MEMBERS
  // =====================
  const viewMembers = async (projectId) => {
    try {
      const { data } = await API.get(`/projects/${projectId}/members`);
      setMembers(data);
      setSelectedProject(projectId);
    } catch (err) {
      console.error(err);
    }
  };

  // =====================
  // ADD MEMBER
  // =====================
  const addMember = async () => {
    if (!userId) return alert("Enter user ID");

    try {
      await API.post(`/projects/${selectedProject}/add-member`, {
        userId,
      });

      setUserId("");
      viewMembers(selectedProject);
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    }
  };

  // =====================
  // REMOVE MEMBER
  // =====================
  const removeMember = async (id) => {
    if (!window.confirm("Deactivate this member?")) return;

    try {
      await API.put(`/projects/${selectedProject}/remove-member`, {
        userId: id,
      });

      viewMembers(selectedProject);
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Projects</h2>

        {/* ================= CREATE ================= */}
        <div style={{ marginBottom: "20px" }}>
          <input
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button onClick={createProject}>Create Project</button>
        </div>

        {/* ================= PROJECT LIST ================= */}
        {projects.length === 0 ? (
          <p>No projects</p>
        ) : (
          projects.map((p) => (
            <div key={p._id} className="project-card">
              <div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>

              <div style={{ marginTop: "10px" }}>
                <button onClick={() => viewMembers(p._id)}>View Members</button>

                <button
                  onClick={() => nav(`/tasks/${p._id}`)}
                  style={{ marginLeft: "10px" }}
                >
                  View Tasks
                </button>
              </div>
            </div>
          ))
        )}

        {/* ================= MEMBERS SECTION ================= */}
        {members.length > 0 && (
          <div className="member-section">
            <h3>Project Members</h3>

            <input
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />

            <button onClick={addMember}>Add Member</button>

            {members.map((m) => (
              <div key={m._id} className="member-card">
                <span>
                  {m.name} ({m.email})
                </span>

                <button
                  onClick={() => removeMember(m._id)}
                  style={{
                    marginLeft: "10px",
                    background: "red",
                    color: "white",
                  }}
                >
                  Deactivate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
