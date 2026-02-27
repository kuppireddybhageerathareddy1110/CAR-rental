import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../components/layouts/DefaultLayout';
import { useSelector } from 'react-redux';
import { User, Mail, ShieldCheck, MapPin, Calendar, CreditCard, Phone, FileText, CheckCircle2, AlertTriangle, Edit3, Save, X, Star } from 'lucide-react';
import moment from 'moment';
import API from '../../api/axiosInstance';
import { message } from 'antd';

function Profile() {
    const user = JSON.parse(localStorage.getItem('user'));
    const { bookings } = useSelector(s => s.bookingsReducer);
    const [currentUser, setCurrentUser] = useState(user);
    const [editMode, setEditMode] = useState(false);
    const [stats, setStats] = useState({ totalBookings: 0, spending: 0 });
    const [formData, setFormData] = useState({
        phone: user.phone || '',
        address: user.address || '',
        drivingLicense: user.drivingLicense || ''
    });

    useEffect(() => {
        if (bookings) {
            const myBookings = bookings.filter(b => b.user === user._id || b.user?._id === user._id);
            const total = myBookings.length;
            const spent = myBookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
            setStats({ totalBookings: total, spending: spent });
        }
        fetchUserData();
    }, [bookings]);

    const fetchUserData = async () => {
        try {
            const res = await API.get('/auth/me');
            setCurrentUser(res.data);
            setFormData({
                phone: res.data.phone || '',
                address: res.data.address || '',
                drivingLicense: res.data.drivingLicense || ''
            });
            localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await API.put('/auth/profile', formData);
            message.success('Profile updated successfully!');
            setCurrentUser(res.data.user);
            localStorage.setItem('user', JSON.stringify({ ...user, ...res.data.user }));
            setEditMode(false);
        } catch (err) {
            message.error('Failed to update profile.');
        }
    };

    return (
        <DefaultLayout>
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">👤 My Profile</h1>
                </div>

                <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px' }}>
                    <div className="profile-left">
                        <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                            <div className="profile-avatar" style={{
                                width: '120px', height: '120px', borderRadius: '50%', background: 'var(--gradient)',
                                margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '3rem', color: 'white'
                            }}>
                                {user.username[0].toUpperCase()}
                            </div>
                            <h2 style={{ marginBottom: '8px' }}>{user.username}</h2>
                            <span className="status-pill" style={{ background: 'var(--accent-blue)20', color: 'var(--accent-blue)' }}>
                                {user.role.toUpperCase()}
                            </span>

                            <div style={{ marginTop: '32px', textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <Mail size={18} color="var(--text-secondary)" />
                                    <span>{user.username.toLowerCase()}@drivex.com</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <ShieldCheck size={18} color="var(--text-secondary)" />
                                    <span>Role: {user.role}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Calendar size={18} color="var(--text-secondary)" />
                                    <span>Joined: {moment().format('MMM YYYY')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-right">
                        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                            <div className="stat-card glass-card" style={{ padding: '24px', position: 'relative' }}>
                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Bookings</h4>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-purple)' }}>{stats.totalBookings}</div>
                            </div>
                            <div className="stat-card glass-card" style={{ padding: '24px', position: 'relative' }}>
                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Spending</h4>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-green)' }}>₹{stats.spending}</div>
                            </div>
                            <div className="stat-card glass-card" style={{ padding: '24px', position: 'relative', background: 'var(--accent-blue)10', border: '1px solid var(--accent-blue)40' }}>
                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>DriveX Credits</h4>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Star size={24} fill="var(--accent-blue)" /> {currentUser.credits || 0}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Earn 5% on every booking!</span>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '32px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3>Account Information</h3>
                                {!editMode ? (
                                    <button className="btn-theme" onClick={() => setEditMode(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Edit3 size={16} /> Edit Profile
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn-gradient" onClick={handleUpdate} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Save size={16} /> Save
                                        </button>
                                        <button className="btn-icon-delete" onClick={() => setEditMode(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Username</label>
                                    <p style={{ fontWeight: '500' }}>{currentUser.username}</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Role</label>
                                    <p style={{ fontWeight: '500' }}>{currentUser.role.toUpperCase()}</p>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phone Number</label>
                                    {editMode ? (
                                        <input className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone number" />
                                    ) : (
                                        <p style={{ fontWeight: '500' }}>{currentUser.phone || 'Not provided'}</p>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Address</label>
                                    {editMode ? (
                                        <input className="form-input" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Enter address" />
                                    ) : (
                                        <p style={{ fontWeight: '500' }}>{currentUser.address || 'Not provided'}</p>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Driving License (ID/URL)</label>
                                    {editMode ? (
                                        <input className="form-input" value={formData.drivingLicense} onChange={e => setFormData({ ...formData, drivingLicense: e.target.value })} placeholder="Enter license number or URL" />
                                    ) : (
                                        <p style={{ fontWeight: '500' }}>{currentUser.drivingLicense || 'Not uploaded'}</p>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Verification Status</label>
                                    {currentUser.isVerified ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontWeight: '600' }}>
                                            <CheckCircle2 size={16} /> Verified Member
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: '600' }}>
                                            <AlertTriangle size={16} /> Pending Verification
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!currentUser.isVerified && !editMode && (
                                <div style={{
                                    marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'var(--accent-purple)10',
                                    border: '1px dashed var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '12px'
                                }}>
                                    <FileText size={20} color="var(--accent-purple)" />
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                        Please ensure your driving license is uploaded and your profile info is complete. An admin will verify your account shortly so you can start booking!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Profile;
