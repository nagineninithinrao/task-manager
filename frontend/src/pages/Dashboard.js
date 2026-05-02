// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const projects = await API.get("/projects");

      let all = [];

      for (let p of projects.data) {
        const t = await API.get(`/tasks/${p._id}`);
        all = [...all, ...t.data];
      }

      setTasks(all);
    };

    fetch();
  }, []);

  const completed = tasks.filter((t) => t.status === "Done").length;

  return (
    <div className="page">
      <div className="card">
        <h2>Member Dashboard</h2>

        <p>Total Tasks: {tasks.length}</p>
        <p>Completed: {completed}</p>

        <div className="list">
          {tasks.map((t) => (
            <div key={t._id} className="list-item">
              {t.title} - {t.status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
