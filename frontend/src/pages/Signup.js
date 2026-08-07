import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        collegeId: '',
        phone: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend validations
        if (form.phone.trim().length !== 10 || !/^\d+$/.test(form.phone.trim())) {
            setError('❌ Phone number must be exactly 10 digits');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase(),
                    password: form.password,
                    role: 'student',
                    collegeId: form.collegeId.trim(),
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || data.message || 'Signup failed');
                return;
            }

            if (!data.token) {
                setError('Signup succeeded but no token received. Please log in.');
                navigate('/login');
                return;
            }

            // Save JWT and user info
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user?.role || 'student');
            localStorage.setItem("userId", data.user?.id || '');
            localStorage.setItem("userName", data.user?.name || '');
            localStorage.setItem("userEmail", data.user?.email || '');

            // Redirect
            navigate("/browse");
        } catch (err) {
            console.error('Signup error:', err);
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">
            <div className="glass-card" style={{ maxWidth: '480px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                    <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </div>
                <h2>Create Account</h2>
                <p style={{ marginTop: '-12px' }}>
                    Join EventSphere to register and manage tickets.
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '12px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="collegeId"
                        placeholder="College ID / Company ID"
                        value={form.collegeId}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone number (10 digits)"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 6 chars)"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />


                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <p className="link-text" onClick={() => navigate('/login')}>
                        Already have an account? Sign in
                    </p>
                    <Link to="/" className="link-text" style={{ fontSize: '0.85rem' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
