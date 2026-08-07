import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Tag, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import EventCard from '../components/EventCard';

function Home() {
    const navigate = useNavigate();
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search fields
    const [nameSearch, setNameSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [categorySearch, setCategorySearch] = useState('All');

    const categories = [
        { name: 'Technology', icon: '💻' },
        { name: 'Business', icon: '📈' },
        { name: 'Workshop', icon: '🔧' },
        { name: 'Music', icon: '🎵' },
        { name: 'Sports', icon: '🏆' },
        { name: 'Networking', icon: '🤝' },
        { name: 'Education', icon: '🎓' },
        { name: 'Hackathon', icon: '🚀' }
    ];

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            // Fetch featured events
            const featuredRes = await fetch('https://eventsphere-95n2.onrender.com/api/events/featured');
            const featuredData = await featuredRes.json();
            const featuredArray = Array.isArray(featuredData)
                ? featuredData
                : featuredData.events || featuredData.data || [];
            setFeaturedEvents(featuredArray.slice(0, 6));

            // Fetch all events and sort by date for upcoming
            const allRes = await fetch('https://eventsphere-95n2.onrender.comapi/events/all');
            const allData = await allRes.json();
            const allArray = Array.isArray(allData)
                ? allData
                : allData.events || allData.data || [];

            // Filter out past events, sort ascending
            const today = new Date();
            const upcoming = allArray
                .filter(e => new Date(e.date) >= today)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            setUpcomingEvents(upcoming.slice(0, 8));
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/browse?search=${nameSearch}&location=${locationSearch}&category=${categorySearch}`);
    };

    const heroImage = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80';

    return (
        <div className="home-page">
            <Navbar />

            {/* Hero Section */}
            <section className="hero-section">
                <div
                    className="hero-bg-overlay"
                    style={{ backgroundImage: `url(${heroImage})` }}
                ></div>
                <div className="hero-gradient"></div>

                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                            <span>Your Ultimate Event Guide</span>
                        </div>
                        <h1 className="hero-title">
                            Discover Professional <br />
                            <span className="hero-title-highlight">Events Around You</span>
                        </h1>
                        <p className="hero-subtitle">
                            Find top-tier conferences, hands-on workshops, competitive hackathons, and high-impact networking events to fuel your career growth.
                        </p>

                        {/* Combined Search Bar */}
                        <div className="hero-search-wrapper">
                            <form className="hero-search-form" onSubmit={handleSearch}>
                                <div className="search-field">
                                    <Search size={18} />
                                    <input
                                        type="text"
                                        placeholder="Event name or keyword..."
                                        value={nameSearch}
                                        onChange={(e) => setNameSearch(e.target.value)}
                                    />
                                </div>
                                <div className="search-field">
                                    <MapPin size={18} />
                                    <input
                                        type="text"
                                        placeholder="City or venue location..."
                                        value={locationSearch}
                                        onChange={(e) => setLocationSearch(e.target.value)}
                                    />
                                </div>
                                <div className="search-field">
                                    <Tag size={18} />
                                    <select
                                        value={categorySearch}
                                        onChange={(e) => setCategorySearch(e.target.value)}
                                    >
                                        <option value="All">All Categories</option>
                                        {categories.map(cat => (
                                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="hero-search-btn">
                                    <span>Browse Events</span>
                                    <ArrowRight size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Explore by Category</h2>
                            <p className="section-desc">Find conferences, workshops, or sports matches matching your vibe.</p>
                        </div>
                    </div>

                    <div className="categories-list">
                        <button
                            className={`category-pill ${categorySearch === 'All' ? 'active' : ''}`}
                            onClick={() => {
                                setCategorySearch('All');
                                navigate('/browse?category=All');
                            }}
                        >
                            <span className="category-pill-icon">✨</span>
                            <span>All Events</span>
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                className={`category-pill ${categorySearch === cat.name ? 'active' : ''}`}
                                onClick={() => {
                                    setCategorySearch(cat.name);
                                    navigate(`/browse?category=${cat.name}`);
                                }}
                            >
                                <span className="category-pill-icon">{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Events Section */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Featured Events</h2>
                            <p className="section-desc">Highly recommended events hand-picked by our curators.</p>
                        </div>
                        <button className="section-actions-link" onClick={() => navigate('/browse')}>
                            <span>View All</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : featuredEvents.length === 0 ? (
                        <div className="no-results" style={{ gridColumn: 'span 3' }}>
                            <div className="no-results-icon">🎟️</div>
                            <h3>No featured events yet</h3>
                            <p>Check back later or browse other listings.</p>
                        </div>
                    ) : (
                        <div className="events-grid">
                            {featuredEvents.map(event => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Upcoming Events Section (Horizontal scroll) */}
            <section className="upcoming-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Upcoming Schedule</h2>
                            <p className="section-desc">Plan ahead and reserve seats for upcoming activities.</p>
                        </div>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : upcomingEvents.length === 0 ? (
                        <div className="no-results">
                            <h3>No upcoming events scheduled</h3>
                            <p>All active events are currently completed or ongoing.</p>
                        </div>
                    ) : (
                        <div className="upcoming-scroller">
                            {upcomingEvents.map(event => (
                                <div key={event._id} className="event-card-wrapper">
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
