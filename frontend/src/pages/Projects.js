import { useEffect, useState } from "react";
import API from "../api/axios";
import AdminNavbar from "../components/Navbar";
import "./projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState([]);

  const [openProjectId, setOpenProjectId] = useState(null);
  const [membersMap, setMembersMap] = useState({});

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/auth/approved");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createProject = async () => {
    if (!title) return alert("Enter project name");

    try {
      await API.post("/projects", { title });
      setTitle("");
      fetchProjects();
    } catch (err) {
      alert("Failed to create project");
    }
  };

  const loadMembers = async (projectId) => {
    try {
      const { data } = await API.get(`/projects/${projectId}/members`);

      setMembersMap((prev) => ({
        ...prev,
        [projectId]: data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleViewMembers = async (projectId) => {
    if (openProjectId === projectId) {
      setOpenProjectId(null);
      return;
    }

    await loadMembers(projectId);
    setOpenProjectId(projectId);
  };

  const toggleAddMembers = async (projectId) => {
    if (openProjectId === projectId + "-add") {
      setOpenProjectId(null);
      return;
    }

    await loadMembers(projectId);
    setOpenProjectId(projectId + "-add");
  };

  const addMember = async (userId, projectId) => {
    try {
      await API.post(`/projects/${projectId}/add-member`, { userId });
      await loadMembers(projectId);
    } catch (err) {
      alert("Failed to add member");
    }
  };
  const removeMember = async (userId, projectId) => {
    try {
      await API.put(`/projects/${projectId}/remove-member`, { userId });
      await loadMembers(projectId);
    } catch (err) {
      alert("Failed to remove member");
    }
  };
  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await API.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  return (
    <div>
      <AdminNavbar />

      <div className="page">
        <div className="card">
          <h2>Project Management</h2>

          <div className="create-box">
            <input
              type="text"
              placeholder="Enter project name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button onClick={createProject}>Create</button>
          </div>

          <div className="project-list">
            {projects.map((p) => {
              const members = membersMap[p._id] || [];

              const memberIds = members.map((m) => m._id);

              const nonMembers = users.filter(
                (u) => !memberIds.includes(u._id),
              );

              return (
                <div key={p._id} className="project-card">
                  <div className="project-header">
                    <h3>{p.title}</h3>

                    <div className="actions">
                      <button onClick={() => toggleViewMembers(p._id)}>
                        View Members
                      </button>

                      <button
                        className="success"
                        onClick={() => toggleAddMembers(p._id)}
                      >
                        Add Members
                      </button>

                      <button
                        className="danger"
                        onClick={() => deleteProject(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {openProjectId === p._id && (
                    <div className="dropdown">
                      <h4>Members</h4>

                      {members.length === 0 && (
                        <p className="empty">No members</p>
                      )}

                      {members.map((m) => (
                        <div key={m._id} className="member-row">
                          <span>{m.name}</span>

                          <button
                            className="danger"
                            onClick={() => removeMember(m._id, p._id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {openProjectId === p._id + "-add" && (
                    <div className="dropdown">
                      <h4>Add Members</h4>

                      {nonMembers.length === 0 && (
                        <p className="empty">All users already added</p>
                      )}

                      {nonMembers.map((u) => (
                        <div key={u._id} className="member-row">
                          <span>{u.name}</span>

                          <button
                            className="success"
                            onClick={() => addMember(u._id, p._id)}
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
