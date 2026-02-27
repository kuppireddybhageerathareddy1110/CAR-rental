import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { LayoutDashboard, CarFront, CalendarCheck, Users, Building2, LogOut, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/cars', label: 'Cars', icon: <CarFront size={18} /> },
    { to: '/admin/bookings', label: 'All Bookings', icon: <CalendarCheck size={18} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
    { to: '/admin/showrooms', label: 'Showrooms', icon: <Building2 size={18} /> },
];

function AdminLayout({ children }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const history = useHistory();
    const location = useLocation();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const handleLogout = () => {
        localStorage.removeItem('user');
        history.push('/login');
    };

    return (
        <div className="admin-wrapper">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <span className="brand-icon"><CarFront size={24} style={{ color: 'var(--accent-blue)' }} /></span>
                    <span className="brand-name">DriveX</span>
                    <span className="role-chip admin-chip">{user?.role === 'admin' ? 'Admin' : 'Showroom'}</span>
                    <button className="btn-theme-toggle" onClick={toggleTheme} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    {adminLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
                        >
                            <span className="sidebar-icon">{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <span className="user-avatar">{user?.username?.[0]?.toUpperCase()}</span>
                        <div>
                            <div className="user-display-name">{user?.username}</div>
                            <div className="user-role-label">Administrator</div>
                        </div>
                    </div>
                    <button className="btn-logout-sidebar" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>
            <main className="admin-main">{children}</main>
        </div>
    );
}

export default AdminLayout;
