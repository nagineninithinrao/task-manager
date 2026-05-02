import { useEffect, useState } from "react";
import API from "../api/axios";
import AdminNavbar from "../components/Navbar";

export default function AdminTasks() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [taskText, setTaskText] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await API.get("/auth/approved");
    setUsers(data);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const assignTask = async () => {
    if (!taskText) return alert("Enter task");

    await API.post("/tasks", {
      title: taskText,
      assignedTo: selectedUser._id,
    });

    setTaskText("");
    setShowModal(false);
    alert("Task Assigned!");
  };

  const viewTasks = async (userId) => {
    const { data } = await API.get(`/tasks/user/${userId}`);
    setTasks(data);
  };

  return (
    <div>
      <AdminNavbar />

      <div className="admin-container">
        <h2>Members Task Management</h2>

        {/* ===== TABLE ===== */}
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
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== TASK DISPLAY ===== */}
        {tasks.length > 0 && (
          <div className="task-list">
            <h3>Tasks</h3>

            {tasks.map((t) => (
              <div key={t._id} className="task-item">
                <span>{t.title}</span>
                <span className={t.status === "Done" ? "done" : "pending"}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Assign Task to {selectedUser.name}</h3>

            <textarea
              placeholder="Enter task..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={assignTask}>Assign</button>
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
