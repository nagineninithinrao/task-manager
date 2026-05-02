import AdminNavbar from "../components/Navbar";

export default function AdminContact() {
  return (
    <div>
      <AdminNavbar />

      <div className="admin-container">
        <h2>Contact</h2>
        <p>Email: support@taskmanager.com</p>
        <p>Phone: +91 9876543210</p>
      </div>
    </div>
  );
}
