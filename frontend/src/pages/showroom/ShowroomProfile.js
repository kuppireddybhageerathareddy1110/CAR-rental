import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowroomLayout from '../../components/layouts/ShowroomLayout';
import { fetchShowrooms, updateShowroom } from '../../api/showroom';
import Spinner from '../../components/common/Spinner';
import { Building2, MapPin, Phone, Mail, Clock, ShieldCheck, Upload, Save, CheckCircle2 } from 'lucide-react';
import { message } from 'antd';

function ShowroomProfile() {
    const dispatch = useDispatch();
    const { loading } = useSelector((s) => s.alertsReducer);
    const user = JSON.parse(localStorage.getItem('user'));
    const [showroom, setShowroom] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user?.showroomId) {
            fetchShowrooms().then(res => {
                const found = res.data.find(s => s._id === user.showroomId);
                if (found) {
                    setShowroom(found);
                } else {
                    // Fallback for demo if not found
                    setShowroom({ _id: user.showroomId, name: user.username + "'s Showroom", isActive: true });
                }
            }).catch(() => {
                setShowroom({ _id: user.showroomId, name: user.username + "'s Showroom", isActive: true });
            });
        } else {
            message.error("Showroom ID not found. Please contact super admin.");
        }
    }, [user?.showroomId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShowroom({ ...showroom, [name]: value });
    };

    const handleNestedChange = (parent, field, value) => {
        setShowroom({
            ...showroom,
            [parent]: { ...showroom[parent], [field]: value }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateShowroom(showroom._id, showroom);
            message.success('Showroom profile updated successfully!');
        } catch (err) {
            message.error('Failed to update showroom profile.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!showroom) return <Spinner />;

    return (
        <ShowroomLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Building2 size={28} style={{ color: 'var(--accent-purple)' }} /> Showroom Profile
                        </h1>
                        <p className="admin-page-sub">Manage your business identity and verification documents</p>
                    </div>
                    <button className="btn-gradient" onClick={handleSave} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginTop: '24px' }}>
                    {/* Sidebar: Logo & Quick Stats */}
                    <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                        <div className="logo-upload-wrap" style={{ marginBottom: '24px' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', background: '#f1f5f9', overflow: 'hidden', border: '2px solid var(--accent-purple)' }}>
                                {showroom.logo ? (
                                    <img src={showroom.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Building2 size={48} style={{ marginTop: '35px', color: '#94a3b8' }} />
                                )}
                            </div>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Logo URL"
                                name="logo"
                                value={showroom.logo || ''}
                                onChange={handleChange}
                                style={{ marginTop: '16px', fontSize: '13px' }}
                            />
                        </div>

                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', justifyContent: 'center' }}>
                                <ShieldCheck size={20} style={{ color: showroom.isActive ? 'var(--accent-green)' : '#ef4444' }} />
                                <span style={{ fontWeight: '700' }}>{showroom.isActive ? 'Active & Verified' : 'Under Review'}</span>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Business Registry ID: {showroom._id}</p>
                        </div>
                    </div>

                    {/* Main Content: Details & Docs */}
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <form onSubmit={handleSave}>
                            <div className="form-section" style={{ marginBottom: '32px' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '18px' }}><Clock size={20} /> Business Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Showroom Name</label>
                                        <input type="text" className="form-input" name="name" value={showroom.name} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Contact Email</label>
                                        <input type="email" className="form-input" name="email" value={showroom.email} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input type="text" className="form-input" name="phone" value={showroom.phone} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Business Hours (Open - Close)</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input type="time" className="form-input" value={showroom.businessHours?.open || '09:00'} onChange={(e) => handleNestedChange('businessHours', 'open', e.target.value)} />
                                            <input type="time" className="form-input" value={showroom.businessHours?.close || '20:00'} onChange={(e) => handleNestedChange('businessHours', 'close', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section" style={{ marginBottom: '32px' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '18px' }}><MapPin size={20} /> Location Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Full Address</label>
                                        <input type="text" className="form-input" name="address" value={showroom.address || ''} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input type="text" className="form-input" name="city" value={showroom.city || ''} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input type="text" className="form-input" name="state" value={showroom.state || ''} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '18px' }}><Upload size={20} /> Verification Documents</h3>
                                <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '12px' }}>
                                    {['Business License', 'GST Certificate', 'Showroom Insurance'].map(docName => (
                                        <div key={docName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ color: 'var(--accent-purple)' }}><CheckCircle2 size={18} /></div>
                                                <span style={{ fontWeight: '600', fontSize: '14px' }}>{docName}</span>
                                            </div>
                                            <button type="button" style={{ color: 'var(--accent-blue)', fontSize: '13px', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }}>Upload New</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ShowroomLayout>
    );
}

export default ShowroomProfile;
