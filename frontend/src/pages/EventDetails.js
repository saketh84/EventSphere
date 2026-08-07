import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, User, Share2, Award, Map, Compass } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/${id}`, { headers });
            const data = await response.json();
            setEvent(data);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
        } else {
            navigate(`/register/${id}`);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('📋 Event link copied to clipboard!');
    };

    if (loading) return <Loader />;
    if (!event) return <div className="not-found" style={{ padding: '100px', textAlign: 'center' }}>Event not found</div>;

    const seatsLeft = (event.capacity || 100) - (event.registrationCount || 0);
    const isSoldOut = seatsLeft <= 0;

    // Dynamic Registration Deadline (24 hours before event)
    const eventDate = new Date(event.date);
    const deadlineDate = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);

    const formattedDate = eventDate.toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const formattedDeadline = deadlineDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';

    return (
        <div className="event-details-page">
            <Navbar />

            <div className="event-details-container">
                {/* Hero Banner */}
                <div className="event-details-hero">
                    <img src={event.image || defaultImage} alt={event.title} />
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <div className="hero-meta">
                            <span><Compass size={14} /> {event.category || 'Professional'}</span>
                            <span><Calendar size={14} /> {formattedDate}</span>
                        </div>
                        <h1 style={{ marginTop: '12px' }}>{event.title}</h1>
                        <div className="hero-meta" style={{ marginTop: '16px' }}>
                            <span><MapPin size={14} /> {event.venue}</span>
                            <span><User size={14} /> Organized by {event.organizer || 'Event Management'}</span>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="event-details-content">
                    {/* Left: Main Details */}
                    <div className="event-main-info">
                        <div className="event-description">
                            <h2>About this Event</h2>
                            <p>{event.description || 'Join us for this exciting event. Learn key industry knowledge, network with professional experts and colleagues, and level up your skill sets. Detailed resources and guides will be shared during the presentation.'}</p>
                        </div>

                        {/* Speaker Section */}
                        <div className="event-speakers-section">
                            <h2>Speakers & Experts</h2>
                            <p className="section-desc" style={{ marginTop: '-12px' }}>Learn from the leaders who drive the industry forward.</p>
                            <div className="speakers-grid">
                                <div className="speaker-card">
                                    <div className="speaker-avatar">SJ</div>
                                    <div className="speaker-name">Dr. Sarah Jenkins</div>
                                    <div className="speaker-role">Lead Architect, Tech Corp</div>
                                </div>
                                <div className="speaker-card">
                                    <div className="speaker-avatar">AM</div>
                                    <div className="speaker-name">Arjun Mehta</div>
                                    <div className="speaker-role">VP of Product, CloudScale</div>
                                </div>
                                <div className="speaker-card">
                                    <div className="speaker-avatar">ER</div>
                                    <div className="speaker-name">Elena Rostova</div>
                                    <div className="speaker-role">Lead Developer Relations</div>
                                </div>
                            </div>
                        </div>

                        {/* Agenda Timeline */}
                        <div className="event-agenda-section">
                            <h2>Event Agenda</h2>
                            <div className="agenda-timeline">
                                <div className="agenda-item">
                                    <div className="agenda-time">09:00 AM - 10:00 AM</div>
                                    <div className="agenda-title">Registration & Welcome Refreshments</div>
                                    <div className="agenda-desc">Pick up badge packets, check-in QR tickets and grab welcome coffee.</div>
                                </div>
                                <div className="agenda-item">
                                    <div className="agenda-time">10:00 AM - 11:30 AM</div>
                                    <div className="agenda-title">Keynote Session: The Future of SaaS Architecture</div>
                                    <div className="agenda-desc">Presented by Dr. Sarah Jenkins. Discussing next-gen developments.</div>
                                </div>
                                <div className="agenda-item">
                                    <div className="agenda-time">11:30 AM - 01:00 PM</div>
                                    <div className="agenda-title">Panel Discussion: Scaling Communities & Networks</div>
                                    <div className="agenda-desc">Interactive session with Q&A from the audience.</div>
                                </div>
                                <div className="agenda-item">
                                    <div className="agenda-time">01:00 PM - 02:00 PM</div>
                                    <div className="agenda-title">Networking Buffet Lunch</div>
                                    <div className="agenda-desc">Connect with peer developers, managers, and companies.</div>
                                </div>
                                <div className="agenda-item">
                                    <div className="agenda-time">02:00 PM - 04:30 PM</div>
                                    <div className="agenda-title">Technical Hands-On Track Breakouts</div>
                                    <div className="agenda-desc">Practical lab exercises. Bring your laptops.</div>
                                </div>
                            </div>
                        </div>

                        {/* Venue Map */}
                        <div className="event-description">
                            <h2>Location Map</h2>
                            <div className="map-placeholder">
                                <Map size={40} style={{ opacity: '0.4' }} />
                                <span style={{ fontWeight: '600' }}>{event.venue}</span>
                                <span style={{ fontSize: '0.85rem' }}>Interactive map loading placeholder</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sticky Sidebar Register Card */}
                    <div className="event-sidebar">
                        <div className="registration-card">
                            <div className="price-tag">
                                {event.price === 0 || event.price === '0' ? 'FREE' : `₹${event.price}`}
                            </div>

                            <div className="seats-info">
                                <Users size={18} />
                                <span>{seatsLeft} Seats Available</span>
                            </div>

                            <div className="seats-progress">
                                <div className="progress-bar">
                                    <div style={{ width: `${Math.min(100, ((event.registrationCount || 0) / (event.capacity || 100)) * 100)}%` }}></div>
                                </div>
                            </div>

                            <button
                                className="register-now-btn"
                                onClick={handleRegisterClick}
                                disabled={isSoldOut}
                            >
                                {isSoldOut ? 'Sold Out' : 'Register Now'}
                            </button>

                            <button className="share-btn" onClick={handleShare}>
                                <Share2 size={16} />
                                <span>Share Event</span>
                            </button>

                            <div className="event-additional-info" style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                                <div className="info-list-item" style={{ marginBottom: '12px' }}>
                                    <span className="info-list-label"><Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Registration Deadline</span>
                                    <span className="info-list-value" style={{ fontSize: '0.9rem' }}>{formattedDeadline}</span>
                                </div>
                                <div className="info-list-item">
                                    <span className="info-list-label"><Award size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Certificate</span>
                                    <span className="info-list-value" style={{ fontSize: '0.9rem' }}>Available post-completion</span>
                                </div>
                            </div>

                            <p className="register-note">Confirm registration to generate your digital entry ticket QR code.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default EventDetails;
