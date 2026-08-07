import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Calendar, MapPin, User, Mail, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

function TicketDetails() {
    const { regId } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTicket();
    }, [regId]);

    const fetchTicket = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://eventsphere-95n2.onrender.com/api/tickets/${regId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTicket(data);
        } catch (error) {
            console.error('Error fetching ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadTicket = () => {
        const ticketElement = document.getElementById('ticket-card');
        // temporarily hide borders or shadows if needed, html2canvas handles it well
        html2canvas(ticketElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            // center the ticket in pdf
            pdf.addImage(imgData, 'PNG', 20, 20, 170, 130);
            pdf.save(`EventSphere-Ticket-${ticket?.event?.title || 'Ticket'}-${regId}.pdf`);
        });
    };

    if (loading) return <Loader />;
    if (!ticket) return <div className="not-found" style={{ padding: '100px', textAlign: 'center' }}>Ticket not found</div>;

    const event = ticket.event;
    const isVerified = ticket.verified;

    const formattedDate = new Date(event?.date).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <div className="ticket-page">
            <Navbar />

            <div className="ticket-container">
                {/* Success Message */}
                <div className="ticket-success-header">
                    <CheckCircle size={56} style={{ color: 'var(--success)' }} />
                    <h1>Registration Confirmed!</h1>
                    <p>You have secured your seat. Your digital entry ticket pass is generated below.</p>
                </div>

                {/* Digital Ticket Pass */}
                <div className="ticket-card" id="ticket-card">
                    <div className="ticket-header">
                        <div className="ticket-brand">EventSphere</div>
                        <div className="ticket-type">ENTRY PASS</div>
                    </div>

                    <div className="ticket-body">
                        <div className="ticket-left">
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
                                    {event?.category || 'General'}
                                </span>
                                <h2>{event?.title}</h2>
                                <div className="ticket-details">
                                    <div className="detail-row">
                                        <Calendar size={14} />
                                        <span>{formattedDate}</span>
                                    </div>
                                    <div className="detail-row">
                                        <MapPin size={14} />
                                        <span>{event?.venue}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="attendee-info">
                                <h4>Attendee Details</h4>
                                <div className="detail-row">
                                    <User size={12} />
                                    <span>{ticket.studentName}</span>
                                </div>
                                <div className="detail-row">
                                    <Mail size={12} />
                                    <span>{ticket.studentEmail}</span>
                                </div>
                                <div className="detail-row">
                                    <Phone size={12} />
                                    <span>ID: {ticket.collegeId || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="ticket-right">
                            <div className="qr-code">
                                <QRCodeCanvas value={regId} size={110} level="H" />
                                <span className="ticket-id-tag">ID: {regId}</span>
                            </div>
                            <div className={`verification-status ${isVerified ? 'verified' : 'pending'}`}>
                                {isVerified ? '✓ Verified' : '⏳ Pending'}
                            </div>
                        </div>
                    </div>

                    <div className="ticket-footer">
                        <p>Show this QR code entry pass at the venue check-in gate. ID proof might be requested.</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="ticket-actions">
                    <button className="download-btn" onClick={downloadTicket}>
                        <Download size={18} />
                        <span>Download Ticket PDF</span>
                    </button>
                    <button className="browse-btn" onClick={() => navigate('/my-registrations')}>
                        <span>View My Registrations</span>
                        <ArrowRight size={16} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                    </button>
                </div>

                {/* Extra info box */}
                <div className="event-info-box">
                    <h3>Event Information</h3>
                    <div className="info-grid">
                        <div><strong>Organizer:</strong> {event?.organizer || 'Event Coordinator'}</div>
                        <div><strong>Capacity limit:</strong> {event?.capacity || 100} seats total</div>
                        <div><strong>Support email:</strong> support@eventsphere.com</div>
                        <div><strong>Venue details:</strong> {event?.venue}</div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default TicketDetails;
