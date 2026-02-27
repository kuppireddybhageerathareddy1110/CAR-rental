import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowroomLayout from '../../components/layouts/ShowroomLayout';
import Spinner from '../../components/common/Spinner';
import { getShowroomStats, fetchShowrooms } from '../../api/showroom';
import { useState } from 'react';
import { Building2, CarFront, CalendarCheck, IndianRupee, MapPin, Phone, Mail, LayoutGrid, List, Activity, TrendingUp, ShieldCheck, FileText } from 'lucide-react';

function ShowroomDashboard() {
    const { loading } = useSelector((s) => s.alertsReducer);
    const user = JSON.parse(localStorage.getItem('user'));
    const [stats, setStats] = useState(null);
    const [showroom, setShowroom] = useState(null);

    useEffect(() => {
        if (user?.showroomId) {
            getShowroomStats(user.showroomId)
                .then(r => setStats(r.data))
                .catch(err => {
                    console.error(err);
                    // Fallback for demo
                    setStats({
                        totalCars: 5, activeBookings: 2, totalRevenue: 15000, utilizationRate: 40, maintenanceCount: 1,
                        inventory: [{ model: 'Demo Car', total: 5, available: 4, rented: 1, maintenance: 0 }]
                    });
                });

            fetchShowrooms().then(res => {
                const found = res.data.find(s => s._id === user.showroomId);
                if (found) setShowroom(found);
                else setShowroom({ name: 'Showroom Admin', description: 'Business Management Portal' });
            }).catch(() => {
                setShowroom({ name: 'Showroom Admin', description: 'Business Management Portal' });
            });
        }
    }, [user?.showroomId]);

    const statCards = [
        { label: 'Total Cars', value: stats?.totalCars ?? '—', icon: <CarFront size={24} />, color: '#4f8ef7' },
        { label: 'Active Bookings', value: stats?.activeBookings ?? '—', icon: <CalendarCheck size={24} />, color: '#a855f7' },
        { label: 'Total Revenue', value: stats?.totalRevenue ? `₹${stats.totalRevenue}` : '—', icon: <IndianRupee size={24} />, color: '#10b981' },
        { label: 'Utilization', value: stats?.utilizationRate ? `${stats.utilizationRate}%` : '—', icon: <TrendingUp size={24} />, color: '#f59e0b' },
        { label: 'Maintenance', value: stats?.maintenanceCount ?? '—', icon: <Activity size={24} />, color: '#ef4444' },
    ];

    return (
        <ShowroomLayout>
            {(loading || !stats) && <Spinner />}
            {!loading && stats && (
                <div className="admin-page">
                    <div className="admin-page-header">
                        <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Building2 size={28} style={{ color: 'var(--accent-purple)' }} /> Showroom Dashboard</h1>
                        <p className="admin-page-sub">Manage your showroom's fleet and bookings</p>
                    </div>

                    <div className="stats-grid">
                        {statCards.map((s) => (
                            <div className="stat-card glass-card" key={s.label}>
                                <div className="stat-icon" style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
                                <div className="stat-info">
                                    <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {showroom && (
                        <div className="showroom-profile-section glass-card" style={{ marginTop: '24px', padding: '24px' }}>
                            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                <img src={showroom.image} alt={showroom.name} style={{ width: '300px', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>{showroom.name}</h2>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{showroom.description}</p>
                                    <div className="showroom-meta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="showroom-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> {showroom.location}</div>
                                        <div className="showroom-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> {showroom.phone}</div>
                                        <div className="showroom-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> {showroom.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="inventory-section" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><List size={22} /> Inventory Breakdown</h2>
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Vehicle Model</th>
                                            <th style={{ textAlign: 'center' }}>Total</th>
                                            <th style={{ textAlign: 'center' }}>Available</th>
                                            <th style={{ textAlign: 'center' }}>Rented</th>
                                            <th style={{ textAlign: 'center' }}>Service</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats?.inventory?.map((item, idx) => (
                                            <tr key={idx}>
                                                <td style={{ fontWeight: '700' }}>{item.model}</td>
                                                <td style={{ textAlign: 'center' }}><span className="badge-value" style={{ background: '#f1f5f9', color: '#475569', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' }}>{item.total}</span></td>
                                                <td style={{ textAlign: 'center' }}><span className="badge-value" style={{ background: '#ecfdf5', color: '#059669', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' }}>{item.available}</span></td>
                                                <td style={{ textAlign: 'center' }}><span className="badge-value" style={{ background: '#eff6ff', color: '#2563eb', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' }}>{item.rented}</span></td>
                                                <td style={{ textAlign: 'center' }}><span className="badge-value" style={{ background: '#fef2f2', color: '#dc2626', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' }}>{item.maintenance}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}><TrendingUp size={22} /> Utilization</h2>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent-blue)', marginBottom: '8px' }}>{stats?.utilizationRate || 0}%</div>
                                <p style={{ color: 'var(--text-secondary)' }}>Fleet Occupancy Rate</p>
                                <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', margin: '20px 0', overflow: 'hidden' }}>
                                    <div style={{ width: `${stats?.utilizationRate || 0}%`, height: '100%', background: 'var(--gradient)', borderRadius: '6px' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    <span>{stats?.activeBookings || 0} Allocated</span>
                                    <span>{(stats?.totalCars || 0) - (stats?.activeBookings || 0)} Idle</span>
                                </div>
                            </div>
                            <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: (stats?.maintenanceCount || 0) > 0 ? '#ef4444' : '#10b981' }}>
                                    <Activity size={18} />
                                    <span style={{ fontWeight: '600' }}>{stats?.maintenanceCount || 0} cars need attention</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="analytics-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginTop: '24px' }}>
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}><IndianRupee size={22} /> Revenue Breakdown</h2>
                                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}><FileText size={14} /> Export to Excel</button>
                            </div>
                            <div style={{ padding: '20px 0' }}>
                                {stats?.inventory?.map((item, idx) => (
                                    <div key={idx} style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                            <span>{item.model}</span>
                                            <span style={{ fontWeight: '700' }}>₹{Math.floor(stats.totalRevenue * (item.total / stats.totalCars))}</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(item.total / stats.totalCars) * 100}%`, height: '100%', background: 'var(--gradient)', borderRadius: '4px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><Activity size={22} /> Maintenance History</h2>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                <div style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: '700' }}>Mercedes-Benz V-Class</span>
                                        <span style={{ color: 'var(--accent-green)' }}>REPAIRED</span>
                                    </div>
                                    <div>Brake pad replacement - Feb 15, 2026</div>
                                </div>
                                <div style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: '700' }}>Toyota Alphard</span>
                                        <span style={{ color: '#f59e0b' }}>PENDING</span>
                                    </div>
                                    <div>Oil change & service - Due in 3 days</div>
                                </div>
                            </div>
                            <button className="btn-outline" style={{ width: '100%', marginTop: '16px', fontSize: '12px' }}>View Full History</button>
                        </div>
                    </div>

                    <div className="admin-quick-actions" style={{ marginTop: '24px' }}>
                        <h2 className="section-title">Quick Actions</h2>
                        <div className="quick-actions-grid">
                            <a href="/showroom/cars" className="quick-card glass-card">
                                <span className="quick-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CarFront size={28} style={{ color: '#4f8ef7' }} /></span>
                                <span>Manage Cars</span>
                            </a>
                            <a href="/showroom/bookings" className="quick-card glass-card">
                                <span className="quick-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CalendarCheck size={28} style={{ color: '#a855f7' }} /></span>
                                <span>View Bookings</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </ShowroomLayout>
    );
}

export default ShowroomDashboard;
