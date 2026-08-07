import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/superAdmin_dashbord.css";

const PlatformSettings = () => {
    return (
        <div className="admin-page-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <div style={{ padding: "30px" }}>
                    <h1 className="dashboard-title">Platform Settings</h1>
                    <div className="card">
                        <h3>Global Platform Configuration</h3>
                        <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
                            Configure global parameters for the EventSphere platform.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Platform Name</label>
                                <input type="text" value="EventSphere" className="modern-input" readOnly style={{ width: "100%" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>System Email Address</label>
                                <input type="email" value="admin@eventsphere.com" className="modern-input" readOnly style={{ width: "100%" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;
