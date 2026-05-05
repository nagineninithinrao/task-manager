import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import "./App.css";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminApprovals from "./pages/AdminApprovals";
import AdminTasks from "./pages/AdminTask";
import AdminContact from "./pages/AdminContact";
import MemberNavbar from "./components/MemberNavBar";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="Admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/approvals" element={<AdminApprovals />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/contact" element={<AdminContact />} />
          <Route path="/member/contact" element={<MemberNavbar />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="Member">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/tasks/:projectId" element={<Tasks />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
