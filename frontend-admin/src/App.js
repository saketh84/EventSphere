import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import StaffLogin from './pages/StaffLogin';
import ManageStaff from './pages/ManageStaff';
import Monitor from './pages/Monitor';
import ViewUsers from "./pages/ViewUsers";
import VerifyTicket from './pages/VerifyTicket';
import Activities from "./pages/Activities";
import Settings from "./pages/Settings";
import { AdminOnlyRoute, RegularAdminOnlyRoute, SuperAdminOnlyRoute, StaffRoute } from './components/RoleRoute';
import Dashboard from "./platform/Dashboard";
import ManageAdmins from "./platform/ManageAdmins";
import ViewOrganizations from "./platform/ViewOrganizations";
import ViewEvents from "./platform/ViewEvents";
import PlatformSettings from "./platform/PlatformSettings";
import './App.css';

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme") || "dark";
    document.body.classList.toggle("dark-theme", savedTheme === "dark");
  }, []);

  return (
    <Router>
      <Routes>
        {/* Home Route - This will be the landing page */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<Login />} />
        <Route path="/volunteer-login" element={<Navigate to="/staff-login" replace />} />
        <Route path="/staff-login" element={<StaffLogin />} />

        {/* Volunteer + admin: verify & analytics */}
        <Route path="/verify" element={<StaffRoute><VerifyTicket /></StaffRoute>} />
        {/* Admin / superadmin only */}
        <Route path="/admin-dashboard" element={<RegularAdminOnlyRoute><AdminDashboard /></RegularAdminOnlyRoute>} />
        <Route path="/adminDashboard" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/volunteer" element={<StaffRoute><VerifyTicket /></StaffRoute>} />
        {/* Admin: register volunteers | Superadmin: manage admins (same page, role-based UI) */}
        <Route path="/activities" element={<RegularAdminOnlyRoute><Activities /></RegularAdminOnlyRoute>} />
        <Route path="/manage-staff" element={<RegularAdminOnlyRoute><ManageStaff /></RegularAdminOnlyRoute>} />
        <Route path="/manage-admins" element={<SuperAdminOnlyRoute><Activities /></SuperAdminOnlyRoute>} />
        <Route path="/settings" element={<AdminOnlyRoute><Settings /></AdminOnlyRoute>} />
        <Route path="/users" element={<AdminOnlyRoute><ViewUsers /></AdminOnlyRoute>} />
        <Route path="/monitor" element={<AdminOnlyRoute><Monitor /></AdminOnlyRoute>} />
        <Route
          path="/dashboard"
          element={
            <SuperAdminOnlyRoute>
              <Dashboard />
            </SuperAdminOnlyRoute>
          }
        />
        <Route
          path="/platform/manage-admins"
          element={
            <SuperAdminOnlyRoute>
              <ManageAdmins />
            </SuperAdminOnlyRoute>
          }
        />
        <Route
          path="/platform/organizations"
          element={
            <SuperAdminOnlyRoute>
              <ViewOrganizations />
            </SuperAdminOnlyRoute>
          }
        />
        <Route
          path="/platform/events"
          element={
            <SuperAdminOnlyRoute>
              <ViewEvents />
            </SuperAdminOnlyRoute>
          }
        />
        <Route
          path="/platform/settings"
          element={
            <SuperAdminOnlyRoute>
              <PlatformSettings />
            </SuperAdminOnlyRoute>
          }
        />
        {/* Unknown paths → landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;