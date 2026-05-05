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
  const [duration, setDuration] = useState("");

  const [users, setUsers] = useState([]);

  // submission states
  const [links, setLinks] = useState({});
  const [files, setFiles] = useState({});

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const { data } = await API.get(`/tasks/project/${projectId}`);
      setTasks(data);
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

  useEffect(() => {
    fetchTasks();
    if (user?.role === "Admin") {
      fetchUsers();
    }
  }, []);

  // CREATE TASK
  const create = async () => {
    if (!title || !assignedTo || !duration) {
      return alert("Fill all fields");
    }

    try {
      await API.post("/tasks", {
        title,
        projectId,
        assignedTo,
        duration: Number(duration),
      });

      setTitle("");
      setAssignedTo("");
      setDuration("");

      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  // SUBMIT TASK
  const submitTask = async (taskId) => {
    try {
      if (!links[taskId] && !files[taskId]) {
        return alert("Upload file or add link!");
      }

      const formData = new FormData();
      formData.append("status", "Done");

      if (links[taskId]) {
        formData.append("submissionLink", links[taskId]);
      }

      if (files[taskId]) {
        formData.append("file", files[taskId]);
      }

      await API.put(`/tasks/${taskId}/status`, formData);

      alert("Task Submitted!");

      fetchTasks();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Submission failed");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Project Tasks</h2>

        {user?.role === "Admin" && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Create Task</h3>

            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="number"
              placeholder="Duration (days)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <select onChange={(e) => setAssignedTo(e.target.value)}>
              <option value="">Assign Member</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.email}
                </option>
              ))}
            </select>

            <button onClick={create}>Create Task</button>
          </div>
        )}

        <div className="list">
          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((t) => (
              <div key={t._id} className="list-item">
                {/* LEFT */}
                <div>
                  <strong>{t.title}</strong>
                  <p>Status: {t.status}</p>

                  <p>
                    Due:{" "}
                    {t.dueDate
                      ? new Date(t.dueDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* RIGHT */}
                <div>
                  {user?.role === "Member" && t.status !== "Done" && (
                    <>
                      <input
                        type="text"
                        placeholder="Submission link"
                        value={links[t._id] || ""}
                        onChange={(e) =>
                          setLinks({
                            ...links,
                            [t._id]: e.target.value,
                          })
                        }
                      />

                      <input
                        type="file"
                        onChange={(e) =>
                          setFiles({
                            ...files,
                            [t._id]: e.target.files[0],
                          })
                        }
                      />

                      <button onClick={() => submitTask(t._id)}>Submit</button>
                    </>
                  )}

                  {t.status === "Done" && (
                    <div>
                      <p style={{ color: "green" }}>✔ Submitted</p>

                      {t.submissionLink && (
                        <a href={t.submissionLink} target="_blank">
                          Link
                        </a>
                      )}

                      {t.submissionFile && (
                        <a
                          href={`https://task-manager-production-b480.up.railway.app/${t.submissionFile}`}
                          target="_blank"
                        >
                          File
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
