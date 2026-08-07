import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Trim email and ensure proper formatting
            const trimmedEmail = email.trim().toLowerCase();
            const trimmedPassword = password.trim();

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: trimmedEmail,
                    password: trimmedPassword
                }),
            });

            const data = await response.json();
            console.log("Response status:", response.status);
            console.log("Response data:", data);

            if (!response.ok) {
                setError(data.error || data.message || 'Login failed');
                return;
            }

            if (!data.token) {
                console.error("Token not received from backend");
                setError("Login failed: Token not received");
                return;
            }

            // Store user data
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.user?.name || '');
            localStorage.setItem("userEmail", data.user?.email || '');
            localStorage.setItem("role", data.user?.role || 'student');
            localStorage.setItem("userId", data.user?.id || '');

            console.log("Login successful, redirecting to browse...");
            navigate('/browse');
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            setError(err.message || "Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </div>
                <h2>Welcome Back</h2>
                <p style={{ marginTop: '-12px' }}>
                    Sign in to EventSphere to discover and register for events.
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
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
                        <span className="link-text" style={{ fontSize: '0.8rem' }} onClick={() => alert('🔑 Reset link password placeholder')}>
                            Forgot Password?
                        </span>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <p className="link-text" onClick={() => navigate('/signup')}>
                        Don't have an account? Sign up
                    </p>
                    <Link to="/" className="link-text" style={{ fontSize: '0.85rem' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
