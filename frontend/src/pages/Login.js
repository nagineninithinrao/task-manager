import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function Login() {
  const { role } = useParams(); // admin / member
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async () => {
    try {
      const { data } = await API.post("/auth/login", form);

      login(data);

      if (data.role === "Admin") {
        nav("/admin");
      } else {
        nav("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>{role === "admin" ? "Admin Login" : "Member Login"}</h2>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={submit}>Login</button>

        {/* 👇 Only for MEMBER */}
        {role === "member" && (
          <p style={{ marginTop: "10px" }}>
            No account?{" "}
            <span
              style={{ color: "#3b82f6", cursor: "pointer" }}
              onClick={() => nav("/signup")}
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
