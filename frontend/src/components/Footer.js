import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Globe, Link2, Code2 } from 'lucide-react';

function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Explore: [
            { name: 'Browse Events', path: '/browse' },
            { name: 'Categories', path: '/browse' },
            { name: 'Upcoming Events', path: '/browse?sort=upcoming' },
        ],
        Support: [
            { name: 'Help Center', path: '/' },
            { name: 'Contact Us', path: '/' },
            { name: 'Privacy Policy', path: '/' },
            { name: 'Terms of Service', path: '/' },
        ],
    };

    const socialIcons = [
        { icon: <MessageCircle size={18} />, url: 'https://twitter.com', label: 'Twitter' },
        { icon: <Globe size={18} />, url: 'https://instagram.com', label: 'Instagram' },
        { icon: <Link2 size={18} />, url: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: <Code2 size={18} />, url: 'https://github.com', label: 'GitHub' },
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Brand Section */}
                <div className="footer-brand">
                    <div className="footer-logo" onClick={() => navigate('/')}>
                        <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                            <path d="M2 12h20" />
                        </svg>
                        <span className="logo-text" style={{ fontSize: '1.2rem' }}>EventSphere</span>
                    </div>
                    <p className="footer-description">
                        Discover and book tickets for professional conferences, workshops, hackathons, and networking events. Elevate your learning and connections.
                    </p>
                    <div className="footer-contact">
                        <div className="contact-item">
                            <Mail size={14} />
                            <span>support@eventsphere.com</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={14} />
                            <span>+1 (555) 019-2834</span>
                        </div>
                        <div className="contact-item">
                            <MapPin size={14} />
                            <span>100 Innovation Way, Suite 400, Tech City</span>
                        </div>
                    </div>
                </div>

                {/* Links Sections */}
                <div className="footer-links">
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="footer-section">
                            <h4>{title}</h4>
                            <ul>
                                {links.map(link => (
                                    <li key={link.name}>
                                        <button onClick={() => navigate(link.path)}>
                                            {link.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter Section */}
                <div className="footer-newsletter">
                    <h4>Stay Connected</h4>
                    <p>Subscribe to get updates on the best events happening around you.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit">Subscribe</button>
                    </form>
                    <div className="social-links">
                        {socialIcons.map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <p>&copy; {currentYear} EventSphere. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <button onClick={() => navigate('/')}>Privacy Policy</button>
                        <button onClick={() => navigate('/')}>Terms of Service</button>
                        <button onClick={() => navigate('/')}>Cookie Settings</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;