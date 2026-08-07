import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/superAdmin_dashbord.css";

const ViewEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/superadmin/events`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="admin-page-layout">
                <AdminSidebar />
                <div className="admin-main-content">
                    <h2 style={{ padding: "40px" }}>Loading Events...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <div style={{ padding: "30px" }}>
                    <h1 className="dashboard-title">Platform Events</h1>
                    <div className="dashboard-grid">
                        {events.length === 0 ? (
                            <div className="card" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                                <h3>No Events Published Yet</h3>
                            </div>
                        ) : (
                            events.map((event) => (
                                <div className="card" key={event._id}>
                                    <h3>{event.title}</h3>
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{event.venue}</p>
                                    <p style={{ fontWeight: "bold", marginTop: "10px", color: "var(--primary)" }}>
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEvents;
