import { useEffect, useState } from "react";
import API from "../api/axios";
import MemberNavbar from "../components/MemberNavBar";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [links, setLinks] = useState({});
  const [files, setFiles] = useState({});

  // 🔥 FETCH TASKS
  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks/my");
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔥 SUBMIT TASK (FIXED)
  const submitTask = async (taskId) => {
    try {
      const formData = new FormData();

      // ✅ MUST INCLUDE STATUS
      formData.append("status", "Done");

      if (links[taskId]) {
        formData.append("submissionLink", links[taskId]);
      }

      if (files[taskId]) {
        formData.append("file", files[taskId]); // 🔥 must match backend
      }

      // 🔍 DEBUG
      console.log("Submitting:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await API.put(`/tasks/${taskId}/status`, formData);

      alert("Task Submitted Successfully!");

      // reset inputs
      setLinks((prev) => ({ ...prev, [taskId]: "" }));
      setFiles((prev) => ({ ...prev, [taskId]: null }));

      fetchTasks();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div>
      <MemberNavbar />

      <div className="dashboard-container">
        <h2>My Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks assigned</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              {/* LEFT */}
              <div className="task-info">
                <h3>{task.title}</h3>

                <p>
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <p>
                  Status:{" "}
                  <span className={task.status === "Done" ? "done" : "pending"}>
                    {task.status}
                  </span>
                </p>
              </div>

              {/* RIGHT */}
              <div className="task-actions">
                {task.status !== "Done" ? (
                  <>
                    {/* LINK INPUT */}
                    <input
                      type="text"
                      placeholder="Submission link"
                      value={links[task._id] || ""}
                      onChange={(e) =>
                        setLinks({
                          ...links,
                          [task._id]: e.target.value,
                        })
                      }
                    />

                    {/* FILE INPUT */}
                    <input
                      type="file"
                      onChange={(e) =>
                        setFiles({
                          ...files,
                          [task._id]: e.target.files[0],
                        })
                      }
                    />

                    {/* SUBMIT BUTTON */}
                    <button
                      className="btn-submit"
                      onClick={() => submitTask(task._id)}
                    >
                      Submit
                    </button>
                  </>
                ) : (
                  <div className="submitted-section">
                    <p>✅ Submitted</p>

                    {task.submissionLink && (
                      <a
                        href={task.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        🔗 View Link
                      </a>
                    )}

                    {task.submissionFile && (
                      <a
                        href={`http://localhost:5000/${task.submissionFile}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        📄 View File
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
  );
}
