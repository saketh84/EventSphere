import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, User, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

function Register() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        usn: '',
        department: '',
        year: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/${id}`);
            const data = await response.json();
            setEvent(data);
        } catch (error) {
            console.error('Error fetching event details for registration:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }

        if (!formData.usn.trim()) {
            newErrors.usn = 'Company/College ID USN is required';
        }

        if (!formData.department) {
            newErrors.department = 'Department selection is required';
        }

        if (!formData.year) {
            newErrors.year = 'Year selection is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        const token = localStorage.getItem("token");

        if (!token) {
            alert("🔒 Session expired. Please login again.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('${process.env.REACT_APP_API_URL}/api/tickets/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    eventId: id,
                    studentName: formData.name,
                    studentEmail: formData.email,
                    collegeId: formData.usn,
                    department: formData.department,
                    year: formData.year,
                    phone: formData.phone
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Keep local values for convenience
                localStorage.setItem('userName', formData.name);
                localStorage.setItem('userEmail', formData.email);
                alert(`✅ Registration successful!\nTicket ID: ${data.reg_id}`);
                navigate(`/ticket/${data.reg_id}`);
            } else {
                alert(data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration API error:', error);
            alert('Server error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (!event) return <div style={{ padding: '100px', textAlign: 'center' }}>Event not found</div>;

    const formattedDate = new Date(event.date).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';

    return (
        <div className="register-page">
            <Navbar />
            <div className="container">
                {/* Back button */}
                <button onClick={() => navigate(`/event/${id}`)} className="nav-link" style={{ marginBottom: '20px', paddingLeft: 0 }}>
                    <ArrowLeft size={16} />
                    <span>Back to Event Details</span>
                </button>

                <div className="register-container">
                    {/* Left: Summary card */}
                    <div className="register-summary-card">
                        <div className="register-summary-img">
                            <img src={event.image || defaultImage} alt={event.title} />
                        </div>
                        <div className="register-summary-content">
                            <span className="category-tag" style={{ display: 'block', marginBottom: '8px' }}>
                                {event.category || 'Professional'}
                            </span>
                            <h2>{event.title}</h2>
                            <div className="register-summary-meta">
                                <div className="meta-item">
                                    <Calendar size={16} />
                                    <span>{formattedDate}</span>
                                </div>
                                <div className="meta-item">
                                    <MapPin size={16} />
                                    <span>{event.venue}</span>
                                </div>
                                <div className="meta-item">
                                    <User size={16} />
                                    <span>{event.organizer || 'Organized by EventSphere'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Registration Form */}
                    <div className="register-form-card">
                        <h2>Registration</h2>
                        <p>Please enter your information to secure your digital QR ticket pass.</p>

                        <form onSubmit={handleRegisterSubmit}>
                            <div className="form-grid">
                                <div className="form-group form-group-full">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="First and last name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={errors.name ? 'error' : ''}
                                    />
                                    {errors.name && <span className="field-error-msg">{errors.name}</span>}
                                </div>

                                <div className="form-group form-group-full">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && <span className="field-error-msg">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Company /CollegeID *</label>
                                    <input
                                        type="text"
                                        placeholder="USN or Employee ID"
                                        value={formData.usn}
                                        onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                                        className={errors.usn ? 'error' : ''}
                                    />
                                    {errors.usn && <span className="field-error-msg">{errors.usn}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        placeholder="10-digit mobile number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={errors.phone ? 'error' : ''}
                                    />
                                    {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Department *</label>
                                    <input
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className={errors.department ? 'error' : ''}
                                    >

                                    </input>
                                    {errors.department && <span className="field-error-msg">{errors.department}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Year *</label>
                                    <input
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className={errors.year ? 'error' : ''}
                                    >

                                    </input>
                                    {errors.year && <span className="field-error-msg">{errors.year}</span>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="register-submit-btn"
                                disabled={submitting}
                            >
                                <CheckCircle size={18} />
                                <span>{submitting ? 'Confirming Registration...' : 'Confirm & Generate Ticket'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Register;
