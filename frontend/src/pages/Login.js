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
    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      console.log("Sending login:", form);

      const { data } = await API.post("/auth/login", form);

      console.log("Login success:", data);

      if (role === "admin" && data.role !== "Admin") {
        setError("This is not an admin account");
        return;
      }

      if (role === "member" && data.role !== "Member") {
        setError("This is not a member account");
        return;
      }

      login(data);

      if (data.role === "Admin") {
        nav("/admin");
      } else {
        nav("/dashboard");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data);

      setError(
        err.response?.data?.message || "Login failed. Check credentials.",
      );
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>{role === "admin" ? "Admin Login" : "Member Login"}</h2>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={submit}>Login</button>

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
