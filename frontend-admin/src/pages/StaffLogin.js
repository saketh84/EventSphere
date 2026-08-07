import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/dashboard.css";

function StaffLogin() {
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
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      if (data.user.role !== "staff") {
        alert("This login is for staff only. Use the admin login page.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("adminEmail", data.user.email);
      localStorage.setItem("name", data.user.name || "");
      localStorage.setItem("adminId", data.user._id || "");
      navigate("/verify");
    } catch (err) {
      console.error(err);
      alert("Server error. Make sure the backend is running.");
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
            <div className="auth-icon-badge">🎫</div>
            <h2>Staff Login</h2>
            <p className="auth-subtitle">Login to verify event tickets</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                className="modern-input"
                placeholder="staff@example.com"
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
            <button
              className="btn-primary auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Admin? <Link to="/login">Go to Admin Login</Link>
            </p>
            <p>
              <Link to="/">← Back to Home</Link>
            </p>
            <p className="auth-hint">
              Staff accounts are created by your Organization Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffLogin;
