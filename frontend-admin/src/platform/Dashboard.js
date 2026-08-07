import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/superAdmin_dashbord.css";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrganizations: 0,
        totalEvents: 0,
        totalUsers: 0,
        totalRegistrations: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/admin/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            setStats(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page-layout">
                <AdminSidebar />
                <div className="admin-main-content">
                    <h2 style={{ padding: "40px" }}>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <div className="dashboard">
                    <h1 className="dashboard-title">Platform Dashboard</h1>
                    <div className="dashboard-grid">
                        <div className="card">
                            <h3>Total Organizers</h3>
                            <h1>{stats.totalOrganizations}</h1>
                        </div>
                        <div className="card">
                            <h3>Total Events</h3>
                            <h1>{stats.totalEvents}</h1>
                        </div>
                        <div className="card">
                            <h3>Total Users</h3>
                            <h1>{stats.totalUsers}</h1>
                        </div>
                        <div className="card">
                            <h3>Total Registrations</h3>
                            <h1>{stats.totalRegistrations}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
