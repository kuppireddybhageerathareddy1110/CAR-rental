import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowroomLayout from '../../components/layouts/ShowroomLayout';
import API from '../../api/axiosInstance';
import Spinner from '../../components/common/Spinner';
import { User, Phone, Mail, MapPin, History, FileText, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Tag, Timeline } from 'antd';
import moment from 'moment';

function CustomerDetail({ match, history }) {
    const [customer, setCustomer] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, bookingsRes] = await Promise.all([
                    API.get(`/admin/users/${match.params.userid}`),
                    API.get(`/showroom/bookings`) // We'll filter this in frontend for now as we don't have a specific user-bookings endpoint for showroom admins
                ]);
                setCustomer(userRes.data);
                setBookings(bookingsRes.data.filter(b => b.user._id === match.params.userid));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !customer) return <Spinner />;

    return (
        <ShowroomLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => history.goBack()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="admin-page-title">👤 Customer Profile: {customer.username}</h1>
                            <p className="admin-page-sub">View verification status and booking history</p>
                        </div>
                    </div>
                    <div>
                        <Tag color={customer.isVerified ? 'green' : 'orange'} style={{ padding: '4px 12px', fontSize: '13px', fontWeight: '700' }}>
                            {customer.isVerified ? 'VERIFIED CUSTOMER' : 'PENDING VERIFICATION'}
                        </Tag>
                    </div>
                </div>

                <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', marginTop: '32px' }}>
                    {/* Sidebar: Personal Info */}
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '800', margin: '0 auto 20px' }}>
                                {customer.username?.[0]?.toUpperCase()}
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>{customer.username}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Customer since {moment(customer.createdAt).format('MMMM YYYY')}</p>
                        </div>

                        <div className="info-list" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Mail size={18} style={{ color: 'var(--accent-blue)' }} />
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>EMAIL ADDRESS</div>
                                    <div style={{ fontWeight: '600' }}>{customer.email}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Phone size={18} style={{ color: 'var(--accent-green)' }} />
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>PHONE NUMBER</div>
                                    <div style={{ fontWeight: '600' }}>{customer.phone || 'Not provided'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'top', gap: '12px', marginBottom: '20px' }}>
                                <MapPin size={18} style={{ color: 'var(--accent-purple)' }} />
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>LOCATION</div>
                                    <div style={{ fontWeight: '600' }}>{customer.address || 'Address not listed'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={16} /> Documents
                            </h4>
                            {customer.drivingLicense ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px' }}>Driving License</span>
                                    <a href={customer.drivingLicense} target="_blank" rel="noreferrer" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-blue)' }}>VIEW DOC</a>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '12px' }}>
                                    <AlertCircle size={14} /> License not uploaded
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content: Booking History */}
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                            <History size={22} style={{ color: 'var(--accent-purple)' }} /> Booking History with Your Showroom
                        </h3>

                        {bookings.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <div style={{ color: '#cbd5e1', marginBottom: '16px' }}><History size={48} /></div>
                                <h3 style={{ color: 'var(--text-muted)' }}>No bookings found for this customer.</h3>
                            </div>
                        ) : (
                            <div className="bookings-timeline" style={{ paddingLeft: '20px' }}>
                                <Timeline>
                                    {bookings.map((b, i) => (
                                        <Timeline.Item key={i} color={b.bookingStatus === 'completed' ? 'green' : b.bookingStatus === 'cancelled' ? 'red' : 'blue'}>
                                            <div style={{ padding: '0 0 24px 12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                    <div>
                                                        <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700' }}>{b.car.name}</h4>
                                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                            {b.bookedTimeSlots.from} — {b.bookedTimeSlots.to}
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: '800', color: 'var(--accent-blue)' }}>₹{b.totalAmount}</div>
                                                        <Tag style={{ margin: '4px 0 0' }}>{b.bookingStatus.toUpperCase()}</Tag>
                                                    </div>
                                                </div>
                                            </div>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ShowroomLayout>
    );
}

export default CustomerDetail;
