import { useEffect, useState } from "react";
import API from "../api/axios";
import AdminNavbar from "../components/Navbar";

export default function AdminApprovals() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  const fetchData = async () => {
    const p = await API.get("/auth/pending");
    const a = await API.get("/auth/approved");

    setPending(p.data);
    setApproved(a.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveUser = async (id) => {
    await API.put(`/auth/approve/${id}`);
    fetchData();
  };

  return (
    <div>
      <AdminNavbar />

      <div className="admin-container">
        <h2>Pending Approvals</h2>

        {pending.length === 0 ? (
          <p>No pending users</p>
        ) : (
          pending.map((u) => (
            <div key={u._id} className="list-item">
              <span>
                {u.name} ({u.email})
              </span>
              <button onClick={() => approveUser(u._id)}>Approve</button>
            </div>
          ))
        )}

        <h2 style={{ marginTop: "30px" }}>Approved Members</h2>

        {approved.map((u) => (
          <div key={u._id} className="list-item">
            {u.name} ({u.email})
          </div>
        ))}
      </div>
    </div>
  );
}
