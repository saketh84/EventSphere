import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
function Activities() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        role: 'volunteer'
    });
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const isSuperAdmin = userRole === "superadmin";

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://eventsphere-95n2.onrender.com/api/users/volunteers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (modalError) setModalError("");
        if (modalSuccess) setModalSuccess("");
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setModalError("Name is required");
            return false;
        }
        if (!formData.email.trim()) {
            setModalError("Email is required");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setModalError("Please enter a valid email address");
            return false;
        }
        if (!formData.password) {
            setModalError("Password is required");
            return false;
        }
        if (formData.password.length < 6) {
            setModalError("Password must be at least 6 characters long");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setModalError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setModalError("");
        setModalSuccess("");

        try {
            const { confirmPassword, ...registrationData } = formData;

            // Volunteers are stored in the Admin model, so use /api/admin/register
            const response = await fetch('https://eventsphere-95n2.onrender.com/api/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...registrationData,
                    // /api/admin/register requires an adminKey to set role
                    adminKey: 'admin123',
                    role: 'volunteer'
                })
            });

            const data = await response.json();

            if (response.ok) {
                setModalSuccess("Volunteer registered successfully!");
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phone: '',
                    address: '',
                    role: 'volunteer'
                });
                fetchUsers();
                setTimeout(() => {
                    setShowAddModal(false);
                    setModalSuccess("");
                }, 2000);
            } else {
                setModalError(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error('Add user error:', error);
            setModalError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm('Are you sure you want to delete this volunteer? This action cannot be undone.');

        if (!confirmed) return;

        try {
            // Volunteers are in the Admin model — delete via /api/admin/:id
            const response = await fetch(`https://eventsphere-95n2.onrender.com/api/admin/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Volunteer deleted successfully');
                fetchUsers();
            } else {
                const error = await response.json();
                alert(error.error || error.message || 'Failed to delete volunteer');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting volunteer');
        }
    };

    return (
        <div className="activities-wrapper">
            <AdminSidebar />
            <div className="activities-main">
                {/* Header Section */}
                <div className="activities-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.5rem' }}>Volunteer Management</h1>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Create, view, and manage volunteer accounts</p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => setShowAddModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                    >
                        <span>+</span> Add New Volunteer
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div className="glass-card" style={{
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem',
                        borderLeft: '4px solid var(--primary)'
                    }}>
                        <div style={{ fontSize: '2rem', padding: '0.75rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px' }}>
                            👥
                        </div>
                        <div>
                            <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.25rem', color: 'var(--text-main)' }}>{users.length}</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>Active Volunteers</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    {loading && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                            <p>Loading volunteers...</p>
                        </div>
                    )}

                    {!loading && users.length === 0 && (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Volunteers Yet</h3>
                            <p style={{ marginBottom: '1.5rem' }}>Get started by adding your first volunteer to the system.</p>
                            <button
                                className="btn-primary"
                                onClick={() => setShowAddModal(true)}
                                style={{ margin: '0 auto' }}
                            >
                                + Add Your First Volunteer
                            </button>
                        </div>
                    )}

                    {!loading && users.length > 0 && (
                        <div className="table-responsive">
                            <table className="volunteers-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Role</th>
                                        <th>Registered On</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user._id}>
                                            <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{index + 1}</td>
                                            <td>
                                                <div className="user-name-cell">
                                                    <div className="user-avatar" style={{
                                                        backgroundColor: 'var(--primary)',
                                                        color: '#ffffff',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</span>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{user.phone || '—'}</td>
                                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {user.address || '—'}
                                            </td>
                                            <td>
                                                <span className="role-badge role-volunteer">
                                                    Volunteer
                                                </span>
                                            </td>
                                            <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                                            <td>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    disabled={!isSuperAdmin}
                                                    title={!isSuperAdmin ? "Only Super Admins can delete" : "Delete volunteer"}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add Volunteer Modal */}
                {showAddModal && (
                    <div className="modal-overlay" onClick={() => !loading && setShowAddModal(false)}>
                        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Register New Volunteer</h2>
                                <button
                                    className="modal-close"
                                    onClick={() => setShowAddModal(false)}
                                    disabled={loading}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="modal-body">
                                {modalError && (
                                    <div className="alert alert-error">
                                        <span className="alert-icon">⚠️</span>
                                        {modalError}
                                    </div>
                                )}

                                {modalSuccess && (
                                    <div className="alert alert-success">
                                        <span className="alert-icon">✅</span>
                                        {modalSuccess}
                                    </div>
                                )}

                                <form onSubmit={handleAddUser}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="modern-input"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter full name"
                                                disabled={loading}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="modern-input"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="volunteer@example.com"
                                                disabled={loading}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Password *</label>
                                            <input
                                                type="password"
                                                name="password"
                                                className="modern-input"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Minimum 6 characters"
                                                disabled={loading}
                                                required
                                            />
                                            <small>Password must be at least 6 characters</small>
                                        </div>

                                        <div className="form-group">
                                            <label>Confirm Password *</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                className="modern-input"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Re-enter password"
                                                disabled={loading}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="modern-input"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="e.g., 9876543210"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Role</label>
                                            <input
                                                type="text"
                                                value="Volunteer"
                                                disabled
                                                className="modern-input role-field-disabled"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Address</label>
                                        <textarea
                                            name="address"
                                            className="modern-input"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Enter full address"
                                            rows="3"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn-cancel"
                                            onClick={() => setShowAddModal(false)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Registering...' : 'Register Volunteer'}
                                        </button>
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

export default Activities;
