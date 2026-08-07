import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, Ticket, Compass } from 'lucide-react';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: <Home size={16} /> },
        { path: '/browse', label: 'Browse Events', icon: <Compass size={16} /> },
    ];

    // Add My Registrations if authenticated
    if (isAuthenticated) {
        navLinks.push({ path: '/my-registrations', label: 'My Registrations', icon: <Ticket size={16} /> });
    }

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                    <span className="logo-text">EventSphere</span>
                </div>

                {/* Desktop Navigation Links */}
                <div className="navbar-links">
                    {navLinks.map(link => (
                        <button
                            key={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={() => navigate(link.path)}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </button>
                    ))}
                </div>

                {/* Desktop Auth Actions */}
                <div className="navbar-right">
                    {isAuthenticated ? (
                        <>
                            <button className="nav-link" onClick={() => navigate('/profile')}>
                                <User size={16} />
                                <span>Profile</span>
                            </button>
                            <button className="login-btn" onClick={handleLogout}>
                                <LogOut size={16} style={{ marginRight: '4px' }} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="login-btn" onClick={() => navigate('/login')}>
                                Login
                            </button>
                            <button className="signup-btn" onClick={() => navigate('/signup')}>
                                Signup
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    {navLinks.map(link => (
                        <button
                            key={link.path}
                            className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={() => {
                                navigate(link.path);
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </button>
                    ))}
                    {isAuthenticated ? (
                        <>
                            <button className="mobile-nav-link" onClick={() => {
                                navigate('/profile');
                                setIsMobileMenuOpen(false);
                            }}>
                                <User size={16} />
                                <span>Profile</span>
                            </button>
                            <button className="mobile-nav-link logout" onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                            }}>
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="mobile-nav-link login" onClick={() => {
                                navigate('/login');
                                setIsMobileMenuOpen(false);
                            }}>
                                Login
                            </button>
                            <button className="mobile-nav-link signup" onClick={() => {
                                navigate('/signup');
                                setIsMobileMenuOpen(false);
                            }}>
                                Signup
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;