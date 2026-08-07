import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/dashboard.css";

function redirectByRole(role, navigate) {
  if (role === "admin") {
    navigate("/admin-dashboard");
  } else if (role === "superadmin") {
    navigate("/platform/manage-admins");
  } else if (role === "staff" || role === "volunteer") {
    navigate("/verify");
  } else {
    navigate("/");
  }
}

function saveSession({ token, role, email, name, id }) {

  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("adminEmail", email);
  localStorage.setItem("name", name || "");
  if (id) {
    localStorage.setItem("adminId", id);
  }
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      saveSession({
        token: data.token,
        role: data.user.role,
        email: data.user.email,
        name: data.user.name,
        id: data.user._id,
      });
      redirectByRole(data.user.role, navigate);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow auth-bg-glow-1" />
      <div className="auth-bg-glow auth-bg-glow-2" />

      <div className="auth-container">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <div className="auth-icon-badge">👑</div>
            <h2>Organizer Login</h2>
            <p className="auth-subtitle">Sign in to manage events and volunteers</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Organizer Email</label>
              <input
                type="email"
                className="modern-input"
                placeholder="Organizer email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                className="modern-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              <Link to="/">← Back to Home</Link>
            </p>
            <p>
              Staff? <Link to="/staff-login">Staff Login</Link>
            </p>
            <p className="auth-hint">
              Organizer accounts are issued by the Platform Administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
