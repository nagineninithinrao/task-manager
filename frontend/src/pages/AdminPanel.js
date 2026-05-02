import { useEffect, useState } from "react";
import API from "../api/axios";
import AdminNavbar from "../components/Navbar";

export default function AdminPanel() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await API.get("/tasks");
    setTasks(data);
  };

  const completed = tasks.filter((t) => t.status === "Done").length;
  const pending = tasks.filter((t) => t.status !== "Done").length;

  const overdue = tasks.filter((t) => {
    return new Date(t.dueDate) < new Date() && t.status !== "Done";
  }).length;

  return (
    <div>
      <AdminNavbar />

      <div className="admin-container">
        <h1>Dashboard</h1>

        <div className="admin-stats">
          <div className="stat-card">
            <h2>{tasks.length}</h2>
            <p>Total</p>
          </div>

          <div className="stat-card">
            <h2>{pending}</h2>
            <p>Pending</p>
          </div>

          <div className="stat-card">
            <h2>{completed}</h2>
            <p>Completed</p>
          </div>

          <div className="stat-card">
            <h2>{overdue}</h2>
            <p>Overdue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
