import React, { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/dashboard.css";

const API = "http://localhost:5000";

function ManageStaff() {
  const token = localStorage.getItem("token");
  const [staff, setStaff] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [assignStaffId, setAssignStaffId] = useState("");
  const [assignEventId, setAssignEventId] = useState("");
  const [assignMsg, setAssignMsg] = useState("");

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchOrgEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/staff/org-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchStaff();
    fetchOrgEvents();
  }, [fetchStaff, fetchOrgEvents]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setModalError("");
    setModalSuccess("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setModalError("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      setModalError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || "Failed to create staff");
        return;
      }
      setModalSuccess("Staff account created successfully!");
      setForm({ name: "", email: "", password: "" });
      fetchStaff();
      setTimeout(() => {
        setShowModal(false);
        setModalSuccess("");
      }, 1500);
    } catch (err) {
      setModalError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      const res = await fetch(`${API}/api/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchStaff();
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setAssignMsg("");
    if (!assignStaffId || !assignEventId) {
      setAssignMsg("Select both staff and event");
      return;
    }
    try {
      const res = await fetch(`${API}/api/staff/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ staffId: assignStaffId, eventId: assignEventId }),
      });
      const data = await res.json();
      setAssignMsg(res.ok ? "✅ Staff assigned to event!" : data.error || "Assignment failed");
      if (res.ok) {
        setAssignStaffId("");
        setAssignEventId("");
      }
    } catch (err) {
      setAssignMsg("Network error");
    }
  };

  return (
    <div className="activities-wrapper">
      <AdminSidebar />
      <div className="activities-main">
        <div className="activities-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-main)", margin: "0 0 0.5rem" }}>Manage Staff</h1>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Create staff, assign events, manage access</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem" }}>
            + Add Staff
          </button>
        </div>

        {/* Assign Staff to Event */}
        <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1rem", color: "var(--text-main)" }}>Assign Staff to Event</h2>
          <form onSubmit={handleAssign} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>Select Staff</label>
              <select className="modern-input" value={assignStaffId} onChange={(e) => setAssignStaffId(e.target.value)}>
                <option value="">-- Select Staff --</option>
                {staff.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>Select Event</label>
              <select className="modern-input" value={assignEventId} onChange={(e) => setAssignEventId(e.target.value)}>
                <option value="">-- Select Event --</option>
                {events.map((ev) => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary">Assign</button>
          </form>
          {assignMsg && <p style={{ marginTop: "0.75rem", color: assignMsg.startsWith("✅") ? "#22c55e" : "#ef4444" }}>{assignMsg}</p>}
        </div>

        {/* Staff Table */}
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          {loading && (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <div className="spinner" style={{ margin: "0 auto 1rem" }}></div>
              <p>Loading staff...</p>
            </div>
          )}
          {!loading && staff.length === 0 && (
            <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
              <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>No Staff Yet</h3>
              <p style={{ marginBottom: "1.5rem" }}>Create staff accounts for your organization.</p>
              <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add First Staff</button>
            </div>
          )}
          {!loading && staff.length > 0 && (
            <div className="table-responsive">
              <table className="volunteers-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s, idx) => (
                    <tr key={s._id}>
                      <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <div className="user-name-cell">
                          <div className="user-avatar" style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: "bold" }}>
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{s.name}</span>
                        </div>
                      </td>
                      <td>{s.email}</td>
                      <td><span className="role-badge role-volunteer">Staff</span></td>
                      <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}</td>
                      <td>
                        <button className="btn-delete" onClick={() => handleDelete(s._id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Staff Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => !loading && setShowModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create Staff Account</h2>
                <button className="modal-close" onClick={() => setShowModal(false)} disabled={loading}>×</button>
              </div>
              <div className="modal-body">
                {modalError && <div className="alert alert-error"><span className="alert-icon">⚠️</span>{modalError}</div>}
                {modalSuccess && <div className="alert alert-success"><span className="alert-icon">✅</span>{modalSuccess}</div>}
                <form onSubmit={handleCreate}>
                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label>Full Name *</label>
                    <input type="text" name="name" className="modern-input" value={form.name} onChange={handleChange} placeholder="Staff name" required disabled={loading} />
                  </div>
                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label>Email Address *</label>
                    <input type="email" name="email" className="modern-input" value={form.email} onChange={handleChange} placeholder="staff@example.com" required disabled={loading} />
                  </div>
                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label>Password * (min 6 chars)</label>
                    <input type="password" name="password" className="modern-input" value={form.password} onChange={handleChange} placeholder="••••••••" required disabled={loading} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={loading}>Cancel</button>
                    <button type="submit" className="btn-submit" disabled={loading}>{loading ? "Creating..." : "Create Staff"}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageStaff;
