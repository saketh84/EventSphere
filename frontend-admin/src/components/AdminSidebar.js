import { useState, useEffect } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";
import '../styles/dashboard.css';

function AdminSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation();
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const isVolunteer = role === "volunteer";
    const isStaff = role === "staff";
    const isSuperAdmin = role === "superadmin";

    const superAdminLinks = [
        {
            to: "/dashboard",
            label: "Dashboard",
            icon: "📊"
        },
        {
            to: "/platform/manage-admins",
            label: "Manage Organizations",
            icon: "🏢"
        },
        {
            to: "/platform/organizations",
            label: "Organizations & Events",
            icon: "📋"
        },
        {
            to: "/platform/events",
            label: "All Events",
            icon: "📅"
        },
        {
            to: "/platform/settings",
            label: "Platform Settings",
            icon: "⚙️"
        }
    ];

    const regularAdminLinks = [
        { to: "/admin-dashboard", label: "Create Event", icon: "➕" },
        { to: "/monitor", label: "Monitor", icon: "📈" },
        { to: "/activities", label: "Manage Volunteers", icon: "🤝" },
        { to: "/manage-staff", label: "Manage Staff", icon: "👥" },
        { to: "/settings", label: "Settings", icon: "⚙️" },
        { to: "/verify", label: "Verify Ticket", icon: "🎫" },
    ];

    const adminLinks = isSuperAdmin ? superAdminLinks : regularAdminLinks;

    const volunteerLinks = [
        { to: "/verify", label: "Verify Ticket", icon: "🎫" },

    ];

    const navLinks = (isVolunteer || isStaff) ? volunteerLinks : adminLinks;

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const logout = () => {
        const role = localStorage.getItem("role");
        localStorage.clear();
        if (role === "volunteer") {
            navigate("/volunteer-login");
        } else if (role === "staff") {
            navigate("/staff-login");
        } else {
            navigate("/login");
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            {/* Hamburger Menu Button - Three Horizontal Lines */}
            <div
                className={`hamburger-menu-btn ${sidebarOpen ? 'active' : ''}`}
                onClick={toggleSidebar}
            >
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && isMobile && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}

            {/* Sidebar */}
            <div className={`admin-sidebar-panel ${sidebarOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <h2>
                        {isStaff ? "Staff" : isVolunteer ? "Volunteer" : isSuperAdmin ? "Super Admin" : "Event Admin"}
                    </h2>

                </div>

                <div className="sidebar-nav-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={location.pathname === link.to ? "active" : ""}
                            onClick={() => isMobile && setSidebarOpen(false)}
                        >
                            {link.icon && <span className="nav-icon">{link.icon}</span>}
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <button
                        className="logout-btn-modern"
                        onClick={logout}
                    >
                        <span className="nav-icon">🚪</span>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}

export default AdminSidebar;
