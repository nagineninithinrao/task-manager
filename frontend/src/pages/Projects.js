import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    API.get("/projects").then((res) => setProjects(res.data));
  }, []);

  const create = async () => {
    await API.post("/projects", { title });
    window.location.reload();
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Projects</h2>

        <input
          placeholder="New project"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={create}>Create</button>

        <div className="list">
          {projects.map((p) => (
            <div
              key={p._id}
              className="list-item"
              onClick={() => nav(`/tasks/${p._id}`)}
            >
              {p.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
