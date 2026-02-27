import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/layouts/AdminLayout';
import Spinner from '../../components/common/Spinner';
import { fetchShowrooms, createShowroom, deleteShowroom, updateShowroom } from '../../api/showroom';
import { message } from 'antd';

function ShowroomManage() {
    const { loading } = useSelector((s) => s.alertsReducer);
    const [showrooms, setShowrooms] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', location: '', description: '', phone: '', email: '' });

    const load = async () => {
        try {
            const res = await fetchShowrooms();
            setShowrooms(res.data);
        } catch (e) {
            console.error(e);
            message.error('Failed to load showrooms');
        }
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await updateShowroom(editingId, form);
                message.success('Showroom updated!');
            } else {
                await createShowroom(form);
                message.success('Showroom created!');
            }
            setShowForm(false);
            setEditMode(false);
            setEditingId(null);
            setForm({ name: '', location: '', description: '', phone: '', email: '' });
            load();
        } catch (e) {
            message.error(e.response?.data?.message || 'Failed to save showroom.');
        }
    };

    const handleEdit = (s) => {
        setForm({
            name: s.name,
            location: s.location,
            description: s.description || '',
            phone: s.phone || '',
            email: s.email || ''
        });
        setEditingId(s._id);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this showroom?')) return;
        try {
            await deleteShowroom(id);
            message.success('Showroom deleted');
            load();
        } catch (e) {
            message.error('Failed to delete.');
        }
    };

    return (
        <AdminLayout>
            {loading && <Spinner />}
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1 className="admin-page-title">🏢 Showrooms</h1>
                    <button
                        className="btn-gradient"
                        onClick={() => {
                            setShowForm(!showForm);
                            if (showForm) {
                                setEditMode(false);
                                setForm({ name: '', location: '', description: '', phone: '', email: '' });
                            }
                        }}
                    >
                        {showForm ? '✕ Cancel' : '+ Add Showroom'}
                    </button>
                </div>

                {showForm && (
                    <div className="create-form-wrap glass-card" style={{ marginBottom: '24px' }}>
                        <h3>{editMode ? 'Edit Showroom' : 'New Showroom'}</h3>
                        <form onSubmit={handleSubmit} className="car-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Showroom Name</label>
                                    <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <button className="btn-gradient" type="submit">{editMode ? 'Update' : 'Create'} Showroom</button>
                        </form>
                    </div>
                )}

                <div className="showrooms-grid">
                    {showrooms.map((s) => (
                        <div key={s._id} className="showroom-card glass-card">
                            <div className="showroom-card-header">
                                <span className="showroom-icon">🏢</span>
                                <div>
                                    <h3 className="showroom-name">{s.name}</h3>
                                    <p className="showroom-location">📍 {s.location}</p>
                                </div>
                            </div>
                            {s.description && <p className="showroom-desc">{s.description}</p>}
                            <div className="showroom-contact">
                                {s.phone && <span>📞 {s.phone}</span>}
                                {s.email && <span>✉️ {s.email}</span>}
                            </div>
                            <div className="last-booking-info" style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                <span>Owner: <strong>{s.adminId?.username || 'System'}</strong></span>
                            </div>
                            <div className="showroom-card-footer" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                <button className="btn-edit-sm" onClick={() => handleEdit(s)} style={{ flex: 1 }}>✏️ Edit</button>
                                <button className="btn-danger-sm" onClick={() => handleDelete(s._id)} style={{ flex: 1 }}>🗑️ Delete</button>
                            </div>
                        </div>
                    ))}
                    {showrooms.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🏢</div>
                            <h3>No showrooms yet</h3>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default ShowroomManage;
