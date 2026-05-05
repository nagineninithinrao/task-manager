import { useEffect, useState } from "react";
import API from "../api/axios";
import AdminNavbar from "../components/Navbar";
import "./admintask.css";

export default function AdminTasks() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  // assign modal
  const [showModal, setShowModal] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [duration, setDuration] = useState("");

  // edit modal
  const [editModal, setEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState("");

  // FETCH USERS

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/auth/approved");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ASSIGN TASK
  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const assignTask = async () => {
    if (!taskText || !duration || !projectId) {
      return alert("Enter task, duration & select project");
    }

    try {
      await API.post("/tasks", {
        title: taskText,
        assignedTo: selectedUser._id,
        duration: Number(duration),
        projectId,
      });

      alert("Task Assigned!");

      setTaskText("");
      setDuration("");
      setProjectId("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to assign task");
    }
  };

  // VIEW TASKS

  const viewTasks = async (userId) => {
    try {
      const { data } = await API.get(`/tasks/user/${userId}`);
      setTasks(data);
      setSelectedUser({ _id: userId });
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT TASK

  const openEdit = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDuration(task.duration);
    setEditModal(true);
  };

  const updateTaskHandler = async () => {
    try {
      await API.put(`/tasks/${editTask._id}`, {
        title: editTitle,
        duration: Number(editDuration),
      });

      alert("Task updated!");

      setEditModal(false);
      viewTasks(selectedUser._id);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // DELETE TASK

  const deleteTaskHandler = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);

      alert("Task deleted!");
      viewTasks(selectedUser._id);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <AdminNavbar />

      <div className="admin-container">
        <h2>Members Task Management</h2>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Assign</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>

                <td>
                  <button className="btn-primary" onClick={() => openModal(u)}>
                    Assign
                  </button>
                </td>

                <td>
                  <button
                    className="btn-secondary"
                    onClick={() => viewTasks(u._id)}
                  >
                    View Tasks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length > 0 && (
          <div className="task-list">
            <h3>Tasks</h3>

            {tasks.map((t) => (
              <div key={t._id} className="task-item">
                <div>
                  <strong>{t.title}</strong>
                  <p>Duration: {t.duration} days</p>
                  <p>
                    Due:{" "}
                    {t.dueDate
                      ? new Date(t.dueDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <span className={t.status === "Done" ? "done" : "pending"}>
                    {t.status}
                  </span>

                  <div style={{ marginTop: "10px" }}>
                    <button onClick={() => openEdit(t)}> Edit</button>

                    <button
                      onClick={() => deleteTaskHandler(t._id)}
                      style={{
                        marginLeft: "8px",
                        background: "red",
                        color: "white",
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  {t.status === "Done" && (
                    <div style={{ marginTop: "8px" }}>
                      {t.submissionLink && (
                        <a href={t.submissionLink} target="_blank">
                          View Link
                        </a>
                      )}

                      {t.submissionFile && (
                        <a
                          href={`https://task-manager-production-b480.up.railway.app/${t.submissionFile}`}
                          target="_blank"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Assign Task</h3>

            <textarea
              placeholder="Enter task..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            />
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Duration (days)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <div>
              <button onClick={assignTask}>Assign</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Task</h3>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <input
              type="number"
              value={editDuration}
              onChange={(e) => setEditDuration(e.target.value)}
            />

            <div>
              <button onClick={updateTaskHandler}>Update</button>
              <button onClick={() => setEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
