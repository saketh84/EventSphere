import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import '../styles/dashboard.css';
function Home() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setTimeout(() => {
            if (role === 'admin') {
                navigate('/login');
            } else {
                navigate('/staff-login');
            }
        }, 300);
    };

    return (
        <div className="home-container">
            {/* Background Animation */}
            <div className="home-bg-animation">
                <div className="bg-circle circle-1"></div>
                <div className="bg-circle circle-2"></div>
                <div className="bg-circle circle-3"></div>
                <div className="bg-circle circle-4"></div>
                <div className="bg-circle circle-5"></div>
            </div>



            {/* Main Content */}
            <div className={`home-content ${isVisible ? 'visible' : ''}`}>
                <div className="home-card">
                    {/* Logo/Badge */}
                    <div className="logo-badge">
                        <div className="badge-icon">🎪</div>
                    </div>

                    {/* Title Section */}
                    <div className="title-section">
                        <h1 className="main-title">
                            <span className="gradient-text">Event Management</span>
                            <br />
                            <span className="sub-title">System</span>
                        </h1>
                        <div className="title-underline"></div>
                    </div>

                    {/* Role Selection */}
                    <div className="role-selection">
                        <p className="select-label">Select Your Role</p>

                        <div className="role-buttons">
                            <button
                                className={`role-btn admin-btn ${selectedRole === 'admin' ? 'clicked' : ''}`}
                                onClick={() => handleRoleSelect('admin')}
                            >
                                <div className="btn-icon">👑</div>
                                <div className="btn-content">
                                    <span className="btn-title">Administrator</span>
                                    <span className="btn-desc">Manage events, users, and system settings</span>
                                </div>
                                <div className="btn-arrow">→</div>
                            </button>

                                            <button
                                className={`role-btn volunteer-btn ${selectedRole === 'staff' ? 'clicked' : ''}`}
                                onClick={() => handleRoleSelect('staff')}
                            >
                                <div className="btn-icon">🎫</div>
                                <div className="btn-content">
                                    <span className="btn-title">Staff</span>
                                    <span className="btn-desc">Verify tickets and assist attendees</span>
                                </div>
                                <div className="btn-arrow">→</div>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="home-footer">
                        <p>© 2026 Event Management System. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;