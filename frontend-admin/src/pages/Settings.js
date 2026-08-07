import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import '../styles/dashboard.css';

function Settings() {
    const [profileName, setProfileName] = useState(localStorage.getItem('name') || 'Admin');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.name) {
                        setProfileName(data.name);
                        localStorage.setItem('name', data.name);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [token]);

    return (
        <div className="admin-page-layout">
            <AdminSidebar />

            <div className="admin-main-content">
                <div className="settings-header">
                    <h1>Profile</h1>
                    <p className="header-subtitle">Welcome, {profileName}</p>
                </div>

                <div className="settings-container" style={{ display: 'block' }}>
                    <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                margin: '0 auto 1rem'
                            }}>
                                {profileName.charAt(0).toUpperCase()}
                            </div>
                            <h2 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem' }}>{profileName}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                Role: {localStorage.getItem('role') || 'Administrator'}
                            </p>
                        </div>

                        <div style={{
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: '2rem',
                            color: 'var(--text-muted)',
                            textAlign: 'center',
                            fontSize: '0.95rem'
                        }}>
                            <p>📝 Custom profile requirements can be added here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
