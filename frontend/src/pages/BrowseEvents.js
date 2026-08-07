import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, MapPin, ListFilter, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import EventCard from '../components/EventCard';

function BrowseEvents() {
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [sortBy, setSortBy] = useState('Upcoming');
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['All', 'Technology', 'Business', 'Workshop', 'Music', 'Sports', 'Networking', 'Education', 'Hackathon'];

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchTerm(params.get('search') || '');
        setSelectedCategory(params.get('category') || 'All');
        setSelectedLocation(params.get('location') || '');
        fetchEvents();
    }, [location]);

    useEffect(() => {
        filterEvents();
    }, [events, searchTerm, selectedCategory, selectedLocation, selectedDate, sortBy]);

    const fetchEvents = async () => {
        try {
            const response = await fetch('${process.env.REACT_APP_API_URL}/api/events/all');
            const data = await response.json();

            const eventsArray = Array.isArray(data)
                ? data
                : data.events || data.data || [];

            setEvents(eventsArray);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterEvents = () => {
        let filtered = Array.isArray(events) ? [...events] : [];

        // 1. Search term filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchLower) ||
                event.venue.toLowerCase().includes(searchLower) ||
                (event.description && event.description.toLowerCase().includes(searchLower))
            );
        }

        // 2. Category filter
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(event => event.category === selectedCategory);
        }

        // 3. Location filter
        if (selectedLocation) {
            const locationLower = selectedLocation.toLowerCase();
            filtered = filtered.filter(event =>
                event.venue.toLowerCase().includes(locationLower)
            );
        }

        // 4. Date filter
        if (selectedDate) {
            filtered = filtered.filter(event => {
                const eventDateStr = new Date(event.date).toDateString();
                const selectedDateStr = new Date(selectedDate).toDateString();
                return eventDateStr === selectedDateStr;
            });
        }

        // 5. Sorting
        if (sortBy === 'Upcoming') {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy === 'Newest') {
            filtered.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        } else if (sortBy === 'Popular') {
            filtered.sort((a, b) => (b.registrationCount || 0) - (a.registrationCount || 0));
        }

        setFilteredEvents(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setSelectedLocation('');
        setSelectedDate('');
        setSortBy('Upcoming');
    };

    return (
        <div className="browse-page">
            <Navbar />

            <div className="browse-header">
                <div className="container">
                    <h1>Discover Events</h1>
                    <p>Find professional conferences, workshops, hackathons, and networking sessions.</p>
                </div>
            </div>

            <div className="container">
                <div className="browse-container">
                    {/* Sidebar filters (Desktop only by default) */}
                    <div className={`browse-sidebar ${showFilters ? 'show-mobile' : ''}`}>
                        <div className="filter-header">
                            <h3>
                                <Filter size={18} />
                                <span>Filters</span>
                            </h3>
                            <button className="clear-filters" onClick={clearFilters}>
                                <RefreshCw size={12} style={{ marginRight: '4px' }} />
                                Reset
                            </button>
                        </div>

                        <div className="filter-group">
                            <label>Categories</label>
                            <div className="category-filters">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`filter-cat ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Filter by Date</label>
                            <input
                                type="date"
                                className="date-filter"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Main content grid */}
                    <div className="browse-content">
                        {/* Top bar controls */}
                        <div className="browse-toolbar">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or venue..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                {/* Location filter input */}
                                <div className="search-box" style={{ width: '220px' }}>
                                    <MapPin size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter by city..."
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                    />
                                </div>

                                {/* Sort By selector */}
                                <div className="search-box" style={{ width: '180px' }}>
                                    <ListFilter size={16} />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', cursor: 'pointer' }}
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Newest">Newest</option>
                                        <option value="Popular">Popular</option>
                                    </select>
                                </div>

                                <button className="mobile-filter-btn" onClick={() => setShowFilters(!showFilters)}>
                                    <Filter size={16} /> Filters
                                </button>
                            </div>
                        </div>

                        {/* Results list */}
                        <div className="results-count" style={{ marginBottom: '24px' }}>
                            Showing {filteredEvents.length} events
                        </div>

                        {loading ? (
                            <Loader />
                        ) : filteredEvents.length === 0 ? (
                            <div className="no-results">
                                <div className="no-results-icon">🔍</div>
                                <h3>No events found</h3>
                                <p>We couldn't find any events matching your selected criteria. Try resetting or adjusting your search filters.</p>
                                <button onClick={clearFilters} className="clear-btn">Reset Filters</button>
                            </div>
                        ) : (
                            <div className="events-grid">
                                {filteredEvents.map(event => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default BrowseEvents;
