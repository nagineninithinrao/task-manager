// src/pages/Tasks.js
import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Tasks() {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);

  const fetchTasks = async () => {
    const { data } = await API.get(`/tasks/${projectId}`);
    setTasks(data);
  };

  const fetchUsers = async () => {
    const { data } = await API.get("/auth/approved"); // 👉 you must create this API
    setUsers(data);
  };

  useEffect(() => {
    fetchTasks();
    if (user?.role === "Admin") {
      fetchUsers();
    }
  }, []);

  const create = async () => {
    if (!title || !assignedTo) return alert("Fill all fields");

    await API.post("/tasks", {
      title,
      projectId,
      assignedTo,
    });

    setTitle("");
    setAssignedTo("");
    fetchTasks();
  };

  const update = async (id, status) => {
    await API.put(`/tasks/${id}/status`, { status });
    fetchTasks();
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Tasks</h2>

        {/* 🔥 ADMIN ONLY */}
        {user?.role === "Admin" && (
          <>
            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select onChange={(e) => setAssignedTo(e.target.value)}>
              <option value="">Assign Member</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.email}
                </option>
              ))}
            </select>

            <button onClick={create}>Add Task</button>
          </>
        )}

        <div className="list">
          {tasks.map((t) => (
            <div key={t._id} className="list-item">
              <span>
                {t.title} - {t.status}
              </span>

              {/* 🔥 MEMBER ONLY */}
              {user?.role === "Member" && (
                <button onClick={() => update(t._id, "Done")}>Mark Done</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
