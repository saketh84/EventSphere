import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, CheckCircle, Clock, Trash2, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

function MyRegistrations() {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://eventsphere-95n2.onrender.com/api/tickets/my-registrations",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();

            if (Array.isArray(data)) {
                setRegistrations(data);
            } else if (Array.isArray(data.registrations)) {
                setRegistrations(data.registrations);
            } else {
                setRegistrations([]);
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelRegistration = async (regId, eventTitle) => {
        if (!window.confirm(`⚠️ Are you sure you want to cancel your registration for "${eventTitle}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://eventsphere-95n2.onrender.com/api/tickets/${regId}/cancel`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('✅ Registration cancelled successfully');
                fetchRegistrations();
            } else {
                alert('❌ Failed to cancel registration');
            }
        } catch (error) {
            console.error('Error cancelling registration:', error);
            alert('Server error occurred');
        }
    };

    const filteredRegistrations = registrations.filter(reg => {
        if (!reg.event) return false;
        const eventDate = new Date(reg.event.date);
        const today = new Date();

        if (activeTab === "upcoming") return eventDate >= today;
        if (activeTab === "past") return eventDate < today;

        return true;
    });

    if (loading) return <Loader />;

    const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80';

    return (
        <div className="my-registrations-page">
            <Navbar />

            <div className="container">
                <div className="page-header">
                    <h1>My Registrations</h1>
                    <p>Track your registered passes, print ticket entries, or manage updates.</p>
                </div>

                {/* Tabs bar */}
                <div className="registrations-tabs">
                    <button
                        className={activeTab === 'upcoming' ? 'active' : ''}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Events
                    </button>
                    <button
                        className={activeTab === 'past' ? 'active' : ''}
                        onClick={() => setActiveTab('past')}
                    >
                        Past Events
                    </button>
                </div>

                {filteredRegistrations.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🎫</div>
                        <h3>No registrations found</h3>
                        <p>You do not have any registered events in this category yet. Explore new workshops or conferences!</p>
                        <button className="browse-btn" onClick={() => navigate('/browse')}>
                            Browse Events
                        </button>
                    </div>
                ) : (
                    <div className="registrations-list">
                        {filteredRegistrations.map(reg => {
                            const event = reg.event;
                            if (!event) return null;
                            const isVerified = reg.verified;
                            const eventDate = new Date(event.date);
                            const isPast = eventDate < new Date();

                            const formattedDate = eventDate.toLocaleDateString("en-US", {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });

                            return (
                                <div key={reg._id} className="registration-card">
                                    <div className="registration-image">
                                        <img src={event.image || defaultImage} alt={event.title} />
                                    </div>
                                    <div className="registration-info">
                                        <div className="registration-header">
                                            <h3>{event.title}</h3>

                                        </div>
                                        <div className="registration-details">
                                            <span><Calendar size={14} /> {formattedDate}</span>
                                            <span><MapPin size={14} /> {event.venue}</span>
                                            <span><Ticket size={14} /> Pass ID: {reg.reg_id}</span>
                                        </div>
                                        <div className="registration-actions">
                                            <button
                                                className="action-btn view"
                                                onClick={() => navigate(`/ticket/${reg.reg_id}`)}
                                            >
                                                <Eye size={14} />
                                                <span>View Ticket Pass</span>
                                            </button>
                                            {!isPast && (
                                                <button
                                                    className="action-btn cancel"
                                                    onClick={() => cancelRegistration(reg.reg_id, event.title)}
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Cancel Pass</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default MyRegistrations;
