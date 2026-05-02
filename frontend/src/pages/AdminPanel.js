import { useEffect, useState } from "react";
import API from "../api/axios";
import AdminNavbar from "../components/Navbar";

export default function AdminPanel() {
  const [tasks, setTasks] = useState([]);

  const fetchData = async () => {
    const projects = await API.get("/projects");

    let allTasks = [];

    for (let p of projects.data) {
      const t = await API.get(`/tasks/${p._id}`);
      allTasks = [...allTasks, ...t.data];
    }

    setTasks(allTasks);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const completed = tasks.filter((t) => t.status === "Done").length;
  const pending = tasks.filter((t) => t.status !== "Done").length;

  return (
    <div>
      <AdminNavbar />

      <div className="admin-container">
        <h1>📊 Dashboard</h1>

        <div className="admin-stats">
          <div className="stat-card">
            <h2>{tasks.length}</h2>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card">
            <h2>{pending}</h2>
            <p>Pending Tasks</p>
          </div>

          <div className="stat-card">
            <h2>{completed}</h2>
            <p>Completed Tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
