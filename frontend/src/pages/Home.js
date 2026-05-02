import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="page">
      <div className="card">
        <h2>Select Role</h2>

        <button onClick={() => nav("/login/admin")}>Login as Admin</button>

        <button className="btn-green" onClick={() => nav("/login/member")}>
          Login as Member
        </button>
      </div>
    </div>
  );
}
