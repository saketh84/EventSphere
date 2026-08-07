import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, BookOpen, GraduationCap,
    Save, Edit2, LogOut, Calendar, Ticket
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await fetch('${process.env.REACT_APP_API_URL}/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) {
                navigate('/login');
                return;
            }
            const data = await response.json();
            setProfile(data);
            setFormData(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('${process.env.REACT_APP_API_URL}/api/auth/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    collegeId: formData.collegeId,
                    department: formData.department,
                    year: formData.year,
                })
            });
            if (response.ok) {
                const updated = await response.json();
                setProfile(updated);
                setFormData(updated);
                setEditing(false);
                localStorage.setItem('userName', updated.name);
                alert('✅ Profile updated successfully');
            } else {
                alert('❌ Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Server error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) return <Loader />;
    if (!profile) return <div style={{ padding: '100px', textAlign: 'center' }}>Profile not found</div>;

    return (
        <div className="profile-page">
            <Navbar />

            <div className="container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-header-avatar">
                        {profile.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="profile-info">
                        <h1>{profile.name}</h1>
                        <p className="profile-email">{profile.email}</p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <button className="edit-profile-btn" onClick={() => setEditing(!editing)}>
                                <Edit2 size={14} />
                                <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
                            </button>
                            <button
                                className="edit-profile-btn"
                                style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--danger)' }}
                                onClick={handleLogout}
                            >
                                <LogOut size={14} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Body */}
                <div className="profile-body">
                    {/* Personal Details Card */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <User size={18} />
                            <h3>Personal Details</h3>
                        </div>
                        <div className="profile-fields">
                            <div className="profile-field">
                                <label><User size={14} /> Full Name</label>
                                {editing ? (
                                    <input
                                        className="profile-input"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        placeholder="Full name"
                                    />
                                ) : (
                                    <span>{profile.name || '—'}</span>
                                )}
                            </div>
                            <div className="profile-field">
                                <label><Mail size={14} /> Email</label>
                                <span>{profile.email}</span>
                            </div>
                            <div className="profile-field">
                                <label><Phone size={14} /> Phone</label>
                                {editing ? (
                                    <input
                                        className="profile-input"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        placeholder="Phone number"
                                    />
                                ) : (
                                    <span>{profile.phone || '—'}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Academic Details Card */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <GraduationCap size={18} />
                            <h3>Academic Details</h3>
                        </div>
                        <div className="profile-fields">
                            <div className="profile-field">
                                <label><BookOpen size={14} /> College ID</label>
                                {editing ? (
                                    <input
                                        className="profile-input"
                                        name="collegeId"
                                        value={formData.collegeId || ''}
                                        onChange={handleChange}
                                        placeholder="College ID"
                                    />
                                ) : (
                                    <span>{profile.collegeId || '—'}</span>
                                )}
                            </div>
                            <div className="profile-field">
                                <label><BookOpen size={14} /> Department</label>
                                {editing ? (
                                    <input
                                        className="profile-input"
                                        name="department"
                                        value={formData.department || ''}
                                        onChange={handleChange}
                                        placeholder="Department"
                                    />
                                ) : (
                                    <span>{profile.department || '—'}</span>
                                )}
                            </div>
                            <div className="profile-field">
                                <label><Calendar size={14} /> Year</label>
                                {editing ? (
                                    <select
                                        className="profile-input"
                                        name="year"
                                        value={formData.year || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                ) : (
                                    <span>{profile.year || '—'}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links Card */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <Ticket size={18} />
                            <h3>Quick Links</h3>
                        </div>
                        <div className="profile-quick-links">
                            <button className="quick-link-btn" onClick={() => navigate('/my-registrations')}>
                                <Ticket size={16} /> My Registrations
                            </button>
                            <button className="quick-link-btn" onClick={() => navigate('/browse')}>
                                <Calendar size={16} /> Browse Events
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                {editing && (
                    <div className="profile-save-bar">
                        <button
                            className="save-btn"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <Save size={16} />
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Profile;
