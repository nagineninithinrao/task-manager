// src/pages/Signup.js
import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    try {
      await API.post("/auth/signup", form);
      alert("Signup request sent. Wait for admin approval.");
      nav("/login/member"); // ✅ FIXED
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Member Signup</h2>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={submit}>Signup</button>
      </div>
    </div>
  );
}
