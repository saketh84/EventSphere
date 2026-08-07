import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/dashboard.css";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminKey: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        alert("Invalid response from server. Is the backend running on port 5000?");
        return;
      }

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      alert("Admin account created! You can log in now.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.message || "Cannot reach server. Start the backend: cd backend && node server.js");
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
            <div className="auth-icon-badge admin-register">📝</div>
            <h2>Become an Organizer</h2>
            <p className="auth-subtitle">Register as an event Organizer</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-field">
              <label>Organizer name</label>
              <input
                name="name"
                className="modern-input"
                placeholder="Organizer name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label>Organizer email</label>
              <input
                name="email"
                type="email"
                className="modern-input"
                placeholder="Organizer email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                name="password"
                type="password"
                className="modern-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <div className="auth-field">
              <label>Secret key</label>
              <input
                name="adminKey"
                type="password"
                className="modern-input"
                placeholder="Enter your Secret Key"
                value={form.adminKey}
                onChange={handleChange}
                required
              />
              <p className="auth-hint"></p>
            </div>
            <button className="btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already registered? <Link to="/login">Login here</Link>
            </p>
            <p>
              <Link to="/">← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
