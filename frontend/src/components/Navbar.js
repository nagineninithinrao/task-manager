import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";
export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div className="navbar">
      <h2>Admin</h2>

      <div className="nav-links">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/approvals">Approvals</Link>
        <Link to="/admin/projects">Projects</Link>
        <Link to="/admin/tasks">Tasks</Link>
        <Link to="/admin/contact">Contact</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
