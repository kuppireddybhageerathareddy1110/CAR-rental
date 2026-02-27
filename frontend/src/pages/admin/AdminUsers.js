import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/layouts/AdminLayout';
import Spinner from '../../components/common/Spinner';
import { loadAllUsers, removeUser, editUser, createAdminUser } from '../../redux/actions/adminActions';
import { fetchShowrooms } from '../../api/showroom';
import { Users, UserPlus, Trash2, CheckCircle2, XCircle, Eye, ShieldCheck, MapPin, Phone } from 'lucide-react';

const ROLES = ['user', 'admin', 'showroom-admin'];

function AdminUsers() {
    const dispatch = useDispatch();
    const { users } = useSelector((s) => s.adminReducer);
    const { loading } = useSelector((s) => s.alertsReducer);
    const [showCreate, setShowCreate] = useState(false);
    const [showrooms, setShowrooms] = useState([]);
    const [form, setForm] = useState({ username: '', password: '', role: 'user', showroomId: '' });

    useEffect(() => {
        dispatch(loadAllUsers());
        fetchShowrooms().then(res => setShowrooms(res.data)).catch(err => console.error(err));
    }, []);

    const roleColors = { user: '#4f8ef7', admin: '#ef4444', 'showroom-admin': '#a855f7' };

    const handleCreate = (e) => {
        e.preventDefault();
        dispatch(createAdminUser(form));
        setShowCreate(false);
        setForm({ username: '', password: '', role: 'user', showroomId: '' });
    };

    const handleShowroomChange = (userId, u) => (e) => {
        const newShowroomId = e.target.value;
        dispatch(editUser(userId, { ...u, showroomId: newShowroomId || null }));
    };

    return (
        <AdminLayout>
            {loading && <Spinner />}
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={28} /> Users Management</h1>
                    <button className="btn-gradient" onClick={() => setShowCreate(!showCreate)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {showCreate ? '✕ Cancel' : <><UserPlus size={18} /> Create User</>}
                    </button>
                </div>

                {showCreate && (
                    <div className="create-form-wrap glass-card">
                        <h3>Create New User / Admin</h3>
                        <form onSubmit={handleCreate} className="create-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Username</label>
                                    <input className="form-input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <select className="form-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                {form.role === 'showroom-admin' && (
                                    <div className="form-group">
                                        <label className="form-label">Assign Showroom</label>
                                        <select className="form-input" value={form.showroomId} onChange={e => setForm({ ...form, showroomId: e.target.value })} required>
                                            <option value="">Select Showroom</option>
                                            {showrooms.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <button className="btn-gradient" type="submit">Create User</button>
                        </form>
                    </div>
                )}

                <div className="admin-table-wrap glass-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Contact & Identity</th>
                                <th>Showroom</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td><strong>{u.username}</strong></td>
                                    <td>
                                        <select
                                            className="form-input-table"
                                            value={u.role}
                                            onChange={(e) => dispatch(editUser(u._id, { ...u, role: e.target.value }))}
                                            style={{
                                                background: roleColors[u.role] + '20',
                                                color: roleColors[u.role],
                                                border: 'none',
                                                fontWeight: '700',
                                                borderRadius: '6px',
                                                padding: '2px 8px'
                                            }}
                                        >
                                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><Phone size={12} /> {u.phone || 'N/A'}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><MapPin size={12} /> {u.address || 'N/A'}</div>
                                            {u.drivingLicense ? (
                                                <a href={u.drivingLicense} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                                                    <Eye size={12} /> View License
                                                </a>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)' }}>No License</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {u.role === 'showroom-admin' ? (
                                            <select
                                                className="form-input-table"
                                                value={u.showroomId?._id || u.showroomId || ''}
                                                onChange={handleShowroomChange(u._id, u)}
                                                style={{ fontSize: '13px', padding: '4px' }}
                                            >
                                                <option value="">Unassigned</option>
                                                {showrooms.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                            </select>
                                        ) : '—'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <select
                                                className="form-input-table"
                                                value={u.isActive ? 'true' : 'false'}
                                                onChange={(e) => dispatch(editUser(u._id, { ...u, isActive: e.target.value === 'true' }))}
                                                style={{
                                                    background: u.isActive ? '#10b98120' : '#ef444420',
                                                    color: u.isActive ? '#10b981' : '#ef4444',
                                                    border: 'none',
                                                    fontWeight: '700',
                                                    borderRadius: '6px',
                                                    padding: '2px 8px'
                                                }}
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>

                                            <button
                                                onClick={() => dispatch(editUser(u._id, { ...u, isVerified: !u.isVerified }))}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                    background: u.isVerified ? 'var(--accent-green)20' : '#f59e0b20',
                                                    color: u.isVerified ? 'var(--accent-green)' : '#f59e0b',
                                                    border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer',
                                                    fontSize: '11px', fontWeight: '700'
                                                }}
                                            >
                                                {u.isVerified ? <><CheckCircle2 size={12} /> Verified</> : <><XCircle size={12} /> Verify Now</>}
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-icon-delete"
                                            onClick={() => window.confirm('Delete user?') && dispatch(removeUser(u._id))}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminUsers;
