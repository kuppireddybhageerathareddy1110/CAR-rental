import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axiosInstance';
import Spinner from '../../components/common/Spinner';
import { Download, Printer, CarFront, Mail, MapPin, Phone, Calendar, CreditCard, ChevronLeft, Settings } from 'lucide-react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

function Invoice() {
    const { id } = useParams();
    const history = useHistory();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooking();
    }, [id]);

    const fetchBooking = async () => {
        try {
            const res = await API.get(`/bookings/${id}`);
            setBooking(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;
    if (!booking) return <div className="p-5 text-center">Invoice not found.</div>;

    const handlePrint = () => window.print();

    return (
        <div className="invoice-page" style={{ padding: '40px 20px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="invoice-actions no-print" style={{ width: '1000px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button className="btn-secondary" onClick={() => history.goBack()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ChevronLeft size={18} /> Back
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-gradient" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Printer size={18} /> Print Invoice
                    </button>
                </div>
            </div>

            <div className="invoice-container glass-card" id="invoice-content" style={{ width: '1000px', background: 'white', padding: '60px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', borderRadius: '24px' }}>
                <div className="invoice-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: '40px', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-blue)' }}>DRIVE<span className="gradient-text">X</span></h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Premium Car Rental Experience</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>INVOICE</h2>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>#{booking._id.toUpperCase()}</p>
                    </div>
                </div>

                <div className="invoice-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '60px' }}>
                    <div>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bill To</h4>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>{booking.user?.username}</div>
                        <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><Mail size={14} /> {booking.user?.email}</div>
                        <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}><Phone size={14} /> {booking.user?.phone || 'N/A'}</div>
                        <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {booking.user?.address || 'N/A'}</div>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking Info</h4>
                        <div style={{ marginBottom: '8px' }}><Calendar size={14} /> <strong>Date:</strong> {moment(booking.createdAt).format('MMM DD, YYYY')}</div>
                        <div style={{ marginBottom: '8px' }}><CreditCard size={14} /> <strong>Payment:</strong> {booking.paymentStatus.toUpperCase()}</div>
                        <div style={{ marginBottom: '8px' }}><Settings size={14} /> <strong>Transaction:</strong> {booking.transactionId || 'SIMULATED_PAY'}</div>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Showroom</h4>
                        <div style={{ fontWeight: '700', marginBottom: '4px' }}>{booking.showroomId?.name || 'Main Branch'}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{booking.showroomId?.location || 'Bangalore, IND'}</div>
                    </div>
                </div>

                <table className="invoice-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '20px', textAlign: 'left' }}>Item Description</th>
                            <th style={{ padding: '20px', textAlign: 'center' }}>Rate</th>
                            <th style={{ padding: '20px', textAlign: 'center' }}>Duration</th>
                            <th style={{ padding: '20px', textAlign: 'right' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <img src={booking.car?.image} alt="" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <div>
                                        <div style={{ fontWeight: '700' }}>{booking.car?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{booking.car?.brand} Premium Edition</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '24px', textAlign: 'center' }}>₹{booking.car?.rentPerHour}/hr</td>
                            <td style={{ padding: '24px', textAlign: 'center' }}>{booking.totalHours} Hours</td>
                            <td style={{ padding: '24px', textAlign: 'right', fontWeight: '700' }}>₹{booking.totalHours * booking.car?.rentPerHour}</td>
                        </tr>
                        {booking.driverRequired && (
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '24px' }}>
                                    <div style={{ fontWeight: '700' }}>Driver Assistance Service</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Professional Chauffeur Service</div>
                                </td>
                                <td style={{ padding: '24px', textAlign: 'center' }}>₹30/hr</td>
                                <td style={{ padding: '24px', textAlign: 'center' }}>{booking.totalHours} Hours</td>
                                <td style={{ padding: '24px', textAlign: 'right', fontWeight: '700' }}>₹{30 * booking.totalHours}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="invoice-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 20px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                            <span style={{ fontWeight: '700' }}>₹{booking.totalAmount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 20px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Tax (0%):</span>
                            <span style={{ fontWeight: '700' }}>₹0</span>
                        </div>
                        <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'var(--gradient)', color: 'white', borderRadius: '12px' }}>
                            <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>Total Paid:</span>
                            <span style={{ fontWeight: '900', fontSize: '1.2rem' }}>₹{booking.totalAmount}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '80px', pt: '40px', borderTop: '1px solid #f1f5f9', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <p>Thank you for choosing DriveX! This is a computer-generated invoice and doesn't require a signature.</p>
                    <p style={{ marginTop: '8px' }}>DriveX Rental Services Pvt. Ltd. | drivex.com | +91 99999-XXXXX</p>
                </div>
            </div>
        </div>
    );
}

export default Invoice;
