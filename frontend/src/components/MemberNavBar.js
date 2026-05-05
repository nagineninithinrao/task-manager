import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MemberNavbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  return (
    <div className="navbar">
      <h2> {user?.name || "User"}</h2>

      <div className="nav-links">
        <Link to="/dashboard">Tasks</Link>
        <Link to="/member/contact">Contact</Link>

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
