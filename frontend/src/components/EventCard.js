import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket, User } from 'lucide-react';

function EventCard({ event }) {
    const navigate = useNavigate();
    
    if (!event) return null;

    const seatsLeft = (event.capacity || 100) - (event.registrationCount || 0);
    const isSoldOut = seatsLeft <= 0;
    const isFree = event.price === 0 || event.price === '0';
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = () => {
        const eventDate = new Date(event.date);
        const today = new Date();
        if (eventDate < today) return 'ended';
        if (seatsLeft <= 0) return 'sold-out';
        if (seatsLeft <= 15) return 'few-left';
        return 'available';
    };

    const getStatusText = () => {
        const eventDate = new Date(event.date);
        const today = new Date();
        if (eventDate < today) return 'Ended';
        if (seatsLeft <= 0) return 'Sold Out';
        if (seatsLeft <= 15) return `Only ${seatsLeft} Left`;
        return 'Registration Open';
    };
    
    const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';

    return (
        <div className="event-card" onClick={() => navigate(`/event/${event._id}`)}>
            <div className="event-card-image">
                <img src={event.image || defaultImage} alt={event.title} loading="lazy" />
                <div className={`event-status-badge ${getStatusColor()}`}>
                    {getStatusText()}
                </div>
                <div className="event-price-badge">
                    {isFree ? 'FREE' : `₹${event.price}`}
                </div>
            </div>
            
            <div className="event-card-content">
                <div className="event-card-category">
                    <span className="category-tag">{event.category || 'Professional'}</span>
                </div>
                
                <h3 className="event-card-title" title={event.title}>{event.title}</h3>
                
                <div className="event-card-meta">
                    <div className="meta-item">
                        <Calendar size={14} />
                        <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="meta-item">
                        <MapPin size={14} />
                        <span>{event.venue}</span>
                    </div>
                    <div className="meta-item">
                        <User size={14} />
                        <span>{event.organizer || 'Organized by EventSphere'}</span>
                    </div>
                </div>
                
                <p className="event-card-description">
                    {event.description ? 
                        (event.description.length > 90 ? 
                            `${event.description.substring(0, 90)}...` : 
                            event.description) : 
                        'Join us for this exclusive event. Learn from industry experts and network with peers.'}
                </p>
                
                <div className="event-card-stats">
                    <div className="stat">
                        <Users size={14} />
                        <span>{event.registrationCount || 0} Registered</span>
                    </div>
                    <div className="stat">
                        <Ticket size={14} />
                        <span>{seatsLeft > 0 ? `${seatsLeft} Seats Left` : '0 Seats Left'}</span>
                    </div>
                </div>
                
                <div className="event-card-progress">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(100, ((event.registrationCount || 0) / (event.capacity || 100)) * 100)}%` }}
                    />
                </div>
                
                <div className="event-actions" style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    <button 
                        className="event-card-btn"
                        style={{ flex: 1 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/event/${event._id}`);
                        }}
                    >
                        Details
                    </button>
                    {!isSoldOut ? (
                        <button 
                            className="event-card-btn"
                            style={{ flex: 1.2, background: 'var(--primary)', borderColor: 'var(--primary)', color: 'white' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/register/${event._id}`);
                            }}
                        >
                            Register
                        </button>
                    ) : (
                        <button 
                            className="event-card-btn"
                            style={{ flex: 1.2 }}
                            disabled
                        >
                            Sold Out
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventCard;