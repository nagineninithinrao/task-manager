import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MemberNavbar() {
  const { logout } = useContext(AuthContext);
  const nav = useNavigate();

  return (
    <div className="navbar">
      <h2>👤 Member</h2>

      <div className="nav-links">
        <Link to="/dashboard">Tasks</Link>
        <Link to="/team">TeamMembers</Link>
        <Link to="/contact">Contact</Link>
        <button
          onClick={() => {
            logout();
            nav("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
