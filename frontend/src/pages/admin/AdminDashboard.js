import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/layouts/AdminLayout';
import Spinner from '../../components/common/Spinner';
import { loadAdminStats, scrapeCarsByAdmin } from '../../redux/actions/adminActions';
import { LayoutDashboard, CarFront, CalendarCheck, IndianRupee, Users, Building2, DownloadCloud, TrendingUp, PieChart, Star } from 'lucide-react';

function AdminDashboard() {
    const dispatch = useDispatch();
    const { stats } = useSelector((s) => s.adminReducer);
    const { loading } = useSelector((s) => s.alertsReducer);

    useEffect(() => { dispatch(loadAdminStats()); }, []);

    const statCards = [
        { label: 'Total Cars', value: stats?.totalCars ?? '—', icon: <CarFront size={24} />, color: '#4f8ef7' },
        { label: 'Total Bookings', value: stats?.totalBookings ?? '—', icon: <CalendarCheck size={24} />, color: '#a855f7' },
        { label: 'Total Revenue', value: stats?.totalRevenue ? `₹${stats.totalRevenue}` : '—', icon: <IndianRupee size={24} />, color: '#10b981' },
        { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: <Users size={24} />, color: '#f59e0b' },
        { label: 'Showrooms', value: stats?.totalShowrooms ?? '—', icon: <Building2 size={24} />, color: '#ef4444' },
    ];

    return (
        <AdminLayout>
            {loading && <Spinner />}
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><LayoutDashboard size={28} style={{ color: 'var(--accent-blue)' }} /> Dashboard</h1>
                    <p className="admin-page-sub">Welcome back, Admin! Here's your overview.</p>
                </div>

                <div className="stats-grid">
                    {statCards.map((s) => (
                        <div className="stat-card glass-card" key={s.label}>
                            <div className="stat-icon" style={{ background: s.color + '20', color: s.color }}>
                                {s.icon}
                            </div>
                            <div className="stat-info">
                                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="analytics-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '40px' }}>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}><PieChart size={20} style={{ color: '#a855f7' }} /> Revenue by Showroom</h3>
                        <div className="analytics-list">
                            {stats?.revenueByShowroom?.length > 0 ? (
                                stats.revenueByShowroom.map((s, i) => (
                                    <div key={i} className="analytics-item" style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                            <span>{s.name}</span>
                                            <strong style={{ color: 'var(--accent-green)' }}>₹{s.amount.toLocaleString()}</strong>
                                        </div>
                                        <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '3px' }}>
                                            <div style={{
                                                background: 'var(--gradient)',
                                                width: `${Math.min((s.amount / stats.totalRevenue) * 100, 100)}%`,
                                                height: '100%',
                                                borderRadius: '3px'
                                            }} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>No revenue data available.</p>
                            )}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}><TrendingUp size={20} style={{ color: '#4f8ef7' }} /> Top Performing Models</h3>
                        <div className="popular-grid">
                            {stats?.popularModels?.length > 0 ? (
                                stats.popularModels.map((m, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontWeight: '900', color: 'var(--text-muted)', fontSize: '1.2rem' }}>0{i + 1}</span>
                                            <span style={{ fontWeight: '600' }}>{m.model}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', fontWeight: '700' }}>
                                            <CalendarCheck size={14} /> {m.count} Bookings
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>No booking data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="admin-quick-actions" style={{ marginTop: '40px' }}>
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="quick-actions-grid">
                        <a href="/admin/cars" className="quick-card glass-card">
                            <span className="quick-icon"><CarFront size={28} style={{ color: '#4f8ef7' }} /></span>
                            <span>Manage Cars</span>
                        </a>
                        <a href="/admin/bookings" className="quick-card glass-card">
                            <span className="quick-icon"><CalendarCheck size={28} style={{ color: '#a855f7' }} /></span>
                            <span>View Bookings</span>
                        </a>
                        <a href="/admin/users" className="quick-card glass-card">
                            <span className="quick-icon"><Users size={28} style={{ color: '#f59e0b' }} /></span>
                            <span>Manage Users</span>
                        </a>
                        <a href="/admin/showrooms" className="quick-card glass-card">
                            <span className="quick-icon"><Building2 size={28} style={{ color: '#ef4444' }} /></span>
                            <span>Manage Showrooms</span>
                        </a>
                        <button onClick={() => dispatch(scrapeCarsByAdmin())} className="quick-card glass-card" style={{ background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                            <span className="quick-icon"><DownloadCloud size={28} style={{ color: '#10b981' }} /></span>
                            <span>Live Scrape Cars</span>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;
