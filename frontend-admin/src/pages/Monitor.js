import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
    Users, Trash2, Search,
    RefreshCw, Mail, Phone, Calendar, MapPin, Ticket,
    AlertCircle
} from 'lucide-react';
import '../styles/dashboard.css';

function Monitor() {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showRegistrations, setShowRegistrations] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    const [form, setForm] =
        useState({

            title: "",
            description: "",
            date: "",
            venue: "",
            image: null
        });

    const [editingId,
        setEditingId] =
        useState(null);

    const [showEditModal,
        setShowEditModal] =
        useState(false);

    useEffect(() => {
        console.log("TOKEN:", localStorage.getItem("token"));
        console.log("ROLE:", localStorage.getItem("role"));
        console.log("EMAIL:", localStorage.getItem("adminEmail"));
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://eventsphere-95n2.onrender.com/api/events/monitor", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log("Monitor data:", data);

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch");
            }

            const eventsData = Array.isArray(data) ? data : data.events || [];
            setEvents(eventsData);
            // Do NOT call setSelectedEvent here — it caused an infinite re-render loop.
            // The user selects an event by clicking "View Users".
        } catch (err) {
            console.log(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {

        const {
            name,
            value,
            files
        } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]:
                files && files.length > 0
                    ? files[0]
                    : value
        }));
    };

    const deleteEvent =
        async (id) => {

            const ok =
                window.confirm(
                    "Delete event?"
                );

            if (!ok) return;

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );
                console.log(
                    "TOKEN:",
                    localStorage.getItem("token")
                );

                const res =
                    await fetch(
                        `https://eventsphere-95n2.onrender.com/api/events/${id}`,
                        {
                            method:
                                "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const data =
                    await res.json();

                console.log(
                    "Delete response:",
                    data
                );

                if (!res.ok) {

                    throw new Error(
                        data.error
                    );
                }

                fetchEvents();

                setRegistrations([]);

                setShowRegistrations(false);

            } catch (err) {

                console.error(
                    "Delete error:",
                    err
                );

                alert(
                    err.message
                );
            }
        };

    const openEdit =
        (eventData) => {

            setSelectedEvent(null);

            setEditingId(
                eventData._id
            );

            setForm({

                title:
                    eventData.title ||
                    "",

                description:
                    eventData.description ||
                    "",

                date:
                    eventData.date
                        ? (() => {
                            const d = new Date(eventData.date);
                            const tzOffset = d.getTimezoneOffset() * 60000;
                            return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
                        })()
                        : "",

                venue:
                    eventData.venue ||
                    "",

                image:
                    null
            });

            setShowEditModal(
                true
            );
        };
    const notifyUsers = async (id) => {
        const msg = prompt("Enter notification message for attendees:");
        if (!msg || !msg.trim()) return;

        try {
            const token = localStorage.getItem("token");
            await fetch(`https://eventsphere-95n2.onrender.com/api/events/notify/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message: msg })
            });

        } catch (err) {
            console.error("Error sending notification:", err);
            alert("Failed to send notification");
        }
    };
    const loadRegistrations = async (id, eventTitle) => {

        try {

            const token =
                localStorage.getItem("token");

            const res =
                await fetch(
                    `https://eventsphere-95n2.onrender.com/api/events/${id}/registrations`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const data =
                await res.json();

            console.log(
                "Registrations:",
                data
            );

            if (!res.ok) {

                throw new Error(
                    data.error ||
                    "Failed to load registrations"
                );
            }

            const registrationsData =
                Array.isArray(data)
                    ? data
                    : [];

            setRegistrations(
                registrationsData
            );

            setSelectedEvent(
                events.find(
                    e => e._id === id
                )
            );

            setShowRegistrations(
                true
            );

            setSearchTerm("");

            setFilterStatus("all");


        } catch (err) {

            console.error(
                "Error loading registrations:",
                err
            );

            alert(
                "Failed to load registrations"
            );
        }
    };

    const updateEvent =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const formData =
                    new FormData();

                formData.append(
                    "title",
                    form.title
                );

                formData.append(
                    "description",
                    form.description
                );

                formData.append(
                    "date",
                    form.date
                );

                formData.append(
                    "venue",
                    form.venue
                );

                if (
                    form.image
                ) {

                    formData.append(
                        "image",
                        form.image
                    );
                }

                const res =
                    await fetch(
                        `https://eventsphere-95n2.onrender.com/api/events/${editingId}`,
                        {
                            method:
                                "PUT",

                            headers:
                            {
                                Authorization:
                                    `Bearer ${token}`
                            },

                            body:
                                formData
                        }
                    );

                const data =
                    await res.json();

                if (
                    !res.ok
                ) {

                    throw new Error(
                        data.error ||
                        "Update failed"
                    );
                }

                setShowEditModal(
                    false
                );

                fetchEvents();

            } catch (
            err
            ) {

                console.error(
                    err
                );

                alert(
                    err.message
                );
            }
        };
    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch = reg.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'verified' && reg.verified) ||
            (filterStatus === 'pending' && !reg.verified);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="admin-page-layout">
            <AdminSidebar />

            <div className="admin-main-content">
                <div className="monitor-header">
                    <div>
                        <h1>Monitor Events</h1>
                        <p className="header-subtitle">Track and manage event registrations</p>
                    </div>
                    <button className="refresh-btn" onClick={fetchEvents}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading events...</p>
                    </div>
                )}

                {error && (
                    <div className="error-container">
                        <p className="error-text">❌ {error}</p>
                        <button className="retry-btn" onClick={fetchEvents}>Retry</button>
                    </div>
                )}

                {!loading && !error && events.length === 0 && (
                    <div className="empty-state">
                        <p>No events found. Create your first event!</p>
                    </div>
                )}

                {/* Events Grid */}
                <div className="events-grid">
                    {events.map((e) => (
                        <div key={e._id} className="event-card-modern">
                            <div className="event-card-header">
                                <h3>{e.title}</h3>
                                <span className={`event-status ${e.active === false ? 'inactive' : 'active'}`}>
                                    {e.active === false ? 'Inactive' : 'Active'}
                                </span>
                            </div>

                            <div className="event-card-body">
                                <p className="event-venue">📍 {e.venue}</p>
                                <p className="event-date">📅 {new Date(e.date).toLocaleDateString()}</p>
                                <p className="event-category">🏷️ {e.category}</p>
                                <p className="event-description">
                                    {e.description || "No description available"}
                                </p>
                                <p className="event-registrations">
                                    👥 Registrations: {e.registrationCount || 0}
                                </p>
                            </div>

                            <div className="event-card-actions">
                                <button
                                    className="btn-view"
                                    onClick={() => loadRegistrations(e._id, e.title)}
                                >
                                    <Users size={16} /> View Users
                                </button>
                                <button
                                    className="btn-notify"
                                    onClick={() => notifyUsers(e._id)}
                                >
                                    <Mail size={16} /> Notify
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={(ev) => {

                                        ev.preventDefault();

                                        ev.stopPropagation();

                                        openEdit(e);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => deleteEvent(e._id)}
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Registrations Section - View Users */}
                {showRegistrations && selectedEvent && (
                    <div className="registrations-section">
                        <div className="registrations-header">
                            <div>
                                <h2>Registered Users for: {selectedEvent.title}</h2>
                            </div>
                            <div className="registrations-actions">
                                <button
                                    className="close-registrations"
                                    onClick={() => {
                                        setShowRegistrations(false);
                                        setRegistrations([]);
                                        setSearchTerm("");
                                        setFilterStatus("all");
                                    }}
                                >
                                    ✕ Close
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="users-filters-bar">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="filter-buttons">
                                <button
                                    className={filterStatus === 'all' ? 'active' : ''}
                                    onClick={() => setFilterStatus('all')}
                                >
                                    All ({registrations.length})
                                </button>


                            </div>
                        </div>

                        {/* Users Table */}
                        {filteredRegistrations.length === 0 ? (
                            <div className="no-results">
                                <AlertCircle size={48} />
                                <p>No users found</p>
                            </div>
                        ) : (
                            <div className="registrations-table-wrapper">
                                <table className="registrations-table-modern">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Contact Info</th>
                                            <th>Registered On</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRegistrations.map((reg) => (
                                            <tr key={reg._id}>
                                                <td>
                                                    <div className="user-name-cell">
                                                        <div className="user-avatar">
                                                            {reg.userName?.charAt(0) || 'U'}
                                                        </div>
                                                        <div className="user-info-details">
                                                            <div className="user-fullname">{reg.userName}</div>
                                                            <div className="user-email-small">{reg.userEmail}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="contact-info">
                                                        <div className="contact-item">
                                                            <Mail size={14} />
                                                            <span>{reg.userEmail}</span>
                                                        </div>
                                                        <div className="contact-item">
                                                            <Phone size={14} />
                                                            <span>{reg.phone || 'No phone'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="date-info">
                                                        <Calendar size={14} />
                                                        <span>{new Date(reg.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="action-buttons">

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
                    <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>User Details</h2>
                            <button className="modal-close" onClick={() => setShowUserModal(false)}>×</button>
                        </div>
                        <div className="user-profile-header">
                            <div className="user-profile-avatar">
                                {selectedUser.userName?.charAt(0) || 'U'}
                            </div>
                            <div className="user-profile-info">
                                <h3>{selectedUser.userName}</h3>
                                <span className={`status-badge ${selectedUser.verified ? 'verified' : 'pending'}`}>
                                    {selectedUser.verified ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                        </div>
                        <div className="user-details-grid">
                            <div className="detail-section">
                                <h4>Contact Information</h4>
                                <div className="detail-item">
                                    <Mail size={18} />
                                    <div>
                                        <label>Email Address</label>
                                        <p>{selectedUser.userEmail}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Phone size={18} />
                                    <div>
                                        <label>Phone Number</label>
                                        <p>{selectedUser.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="detail-section">
                                <h4>Registration Details</h4>
                                <div className="detail-item">
                                    <Calendar size={18} />
                                    <div>
                                        <label>Registered On</label>
                                        <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Ticket size={18} />
                                    <div>
                                        <label>Ticket ID</label>
                                        <p>{selectedUser.ticketId || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <MapPin size={18} />
                                    <div>
                                        <label>Event</label>
                                        <p>{selectedEvent?.title}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowUserModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowEditModal(false)}
                >
                    <div
                        className="modal-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Edit Event</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <form className="modern-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <label>Event Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Title"
                                        className="modern-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Description"
                                        className="modern-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        className="modern-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Venue</label>
                                    <input
                                        type="text"
                                        name="venue"
                                        value={form.venue}
                                        onChange={handleChange}
                                        placeholder="Venue"
                                        className="modern-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Event Banner Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={updateEvent}
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Monitor;
