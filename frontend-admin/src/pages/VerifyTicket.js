import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import {
    ShieldCheck, CheckCircle, XCircle,
    AlertCircle, User, Calendar, MapPin, Ticket,
    RefreshCw, History, Download, Mail
} from 'lucide-react';
import '../styles/dashboard.css';

function VerifyTicket() {
    const navigate = useNavigate();
    const [ticketId, setTicketId] = useState('');
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [verificationHistory, setVerificationHistory] = useState([]);

    const token = localStorage.getItem('token');
    const adminName = localStorage.getItem('name');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        loadVerificationHistory();
    }, [token]);

    const loadVerificationHistory = () => {
        const saved = localStorage.getItem('verificationHistory');
        if (saved) {
            setVerificationHistory(JSON.parse(saved));
        }
    };

    const saveToHistory = (ticketData, status) => {
        const historyItem = {
            id: Date.now(),
            ticketId: ticketId,
            userName: ticketData.userName,
            userEmail: ticketData.userEmail,
            eventName: ticketData.eventName,
            status: status.status,
            message: status.message,
            verifiedBy: adminName,
            verifiedAt: new Date().toISOString(),
            timestamp: new Date().toLocaleString()
        };

        const updatedHistory = [historyItem, ...verificationHistory].slice(0, 50);
        setVerificationHistory(updatedHistory);
        localStorage.setItem('verificationHistory', JSON.stringify(updatedHistory));
    };

    // TICKET VERIFICATION
    const handleTicketVerify = async (e) => {
        e.preventDefault();
        if (!ticketId.trim()) {
            alert('Please enter a ticket ID');
            return;
        }

        setLoading(true);
        setVerificationStatus(null);

        try {
            const response = await fetch('http://localhost:5000/api/tickets/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    qrCodeId: ticketId.trim().toUpperCase(),
                    verifiedBy: adminName,
                    verifiedAt: new Date().toISOString()
                })
            });

            const data = await response.json();
            setVerificationStatus(data);

            if (data.ticketDetails) {
                saveToHistory(data.ticketDetails, data);
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationStatus({
                status: 'Error',
                message: 'Server connection failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = () => {
        if (window.confirm('Clear all verification history?')) {
            setVerificationHistory([]);
            localStorage.removeItem('verificationHistory');
        }
    };

    const handleExportHistory = () => {
        const csv = convertToCSV(verificationHistory);
        downloadCSV(csv, `verification_history_${new Date().toISOString().split('T')[0]}.csv`);
    };

    const convertToCSV = (data) => {
        if (data.length === 0) return '';
        const headers = ['ID', 'User Name', 'User Email', 'Event', 'Status', 'Verified By', 'Time'];
        const rows = data.map(item => [
            item.ticketId || 'N/A',
            item.userName,
            item.userEmail,
            item.eventName,
            item.status,
            item.verifiedBy,
            item.timestamp
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    };

    const downloadCSV = (csv, filename) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Verified': return '#22c55e';
            case 'Rejected': return '#ef4444';
            case 'Already Verified': return '#f59e0b';
            case 'Invalid': return '#ef4444';
            case 'Error': return '#ef4444';
            default: return '#6366f1';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Verified': return <CheckCircle size={48} />;
            case 'Rejected': return <XCircle size={48} />;
            case 'Already Verified': return <AlertCircle size={48} />;
            case 'Invalid': return <XCircle size={48} />;
            case 'Error': return <XCircle size={48} />;
            default: return <ShieldCheck size={48} />;
        }
    };

    return (
        <div className="verify-container">
            <AdminSidebar />

            <div className="verify-main-content">
                <div className="verify-header">
                    <h1>Ticket Verification</h1>
                    <p className="header-subtitle">Enter ticket code to check authenticity</p>
                </div>

                <div className="verify-grid-layout" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2.5rem',
                    marginTop: '2rem'
                }}>
                    {/* Verification Form */}
                    <div className="verification-card glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
                        <div className="verification-icon" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            color: getStatusColor(verificationStatus?.status)
                        }}>
                            {getStatusIcon(verificationStatus?.status)}
                        </div>

                        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Verify Ticket ID</h2>

                        <form onSubmit={handleTicketVerify} className="verify-form">
                            <div className="input-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                <Ticket size={18} className="input-icon" style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }} />
                                <input
                                    id="ticket-input"
                                    type="text"
                                    placeholder="Enter Ticket ID / QR Code"
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                                    autoFocus
                                    className="modern-input"
                                    style={{ paddingLeft: '2.75rem', width: '100%' }}
                                />
                            </div>

                            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                                {loading ? (
                                    <>
                                        <RefreshCw size={18} className="spinning" style={{ marginRight: '8px' }} />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={18} style={{ marginRight: '8px' }} />
                                        Verify Ticket
                                    </>
                                )}
                            </button>
                        </form>

                        {verificationStatus && (
                            <div className="verification-result" style={{
                                borderTop: `2px solid ${getStatusColor(verificationStatus.status)}`,
                                marginTop: '2rem',
                                paddingTop: '1.5rem'
                            }}>
                                <div className="result-header" style={{ marginBottom: '1rem' }}>
                                    <span className="result-status" style={{
                                        color: getStatusColor(verificationStatus.status),
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}>
                                        {verificationStatus.status === 'Verified' && '✅ '}
                                        {verificationStatus.status === 'Already Verified' && '⚠️ '}
                                        {verificationStatus.status === 'Invalid' && '❌ '}
                                        {verificationStatus.message}
                                    </span>
                                </div>

                                {verificationStatus.ticketDetails && (
                                    <div className="ticket-details">
                                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Ticket Details</h3>
                                        <div className="details-grid" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr',
                                            gap: '0.75rem'
                                        }}>
                                            <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                                <User size={16} />
                                                <span>Attendee: {verificationStatus.ticketDetails.userName}</span>
                                            </div>
                                            <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                                <Mail size={16} />
                                                <span>Email: {verificationStatus.ticketDetails.userEmail}</span>
                                            </div>
                                            <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                                <Calendar size={16} />
                                                <span>Event: {verificationStatus.ticketDetails.eventName}</span>
                                            </div>
                                            {verificationStatus.ticketDetails.venue && (
                                                <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                                    <MapPin size={16} />
                                                    <span>Venue: {verificationStatus.ticketDetails.venue}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* History Column */}
                    <div className="history-column glass-card" style={{ padding: '2rem' }}>
                        <div className="history-header" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '1rem'
                        }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                <History size={18} />
                                Recent History
                            </h3>
                            {verificationHistory.length > 0 && (
                                <div className="history-actions" style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button onClick={handleExportHistory} className="btn-secondary" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        fontSize: '0.8rem',
                                        padding: '0.4rem 0.8rem'
                                    }}>
                                        <Download size={14} /> Export CSV
                                    </button>
                                    <button onClick={handleClearHistory} className="btn-delete" style={{
                                        fontSize: '0.8rem',
                                        padding: '0.4rem 0.8rem'
                                    }}>
                                        Clear History
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="history-list" style={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            {verificationHistory.length === 0 ? (
                                <div className="empty-history" style={{
                                    textAlign: 'center',
                                    padding: '3rem 1rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <ShieldCheck size={40} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                    <p style={{ margin: 0 }}>No verification history yet</p>
                                </div>
                            ) : (
                                verificationHistory.map((item) => (
                                    <div key={item.id} className="history-item" style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'rgba(255,255,255,0.02)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                            <span style={{ fontWeight: 'bold', color: item.status === 'Verified' ? '#22c55e' : '#ef4444' }}>
                                                {item.status}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)' }}>{item.timestamp}</span>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                            <strong>ID:</strong> {item.ticketId}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            <strong>User:</strong> {item.userName} ({item.userEmail})
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            <strong>Event:</strong> {item.eventName}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyTicket;
