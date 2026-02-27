import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { LayoutDashboard, CarFront, CalendarCheck, Building2, LogOut, UserCircle } from 'lucide-react';

const showroomLinks = [
    { to: '/showroom', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/showroom/cars', label: 'My Cars', icon: <CarFront size={18} /> },
    { to: '/showroom/bookings', label: 'Bookings', icon: <CalendarCheck size={18} /> },
    { to: '/showroom/profile', label: 'My Showroom', icon: <Building2 size={18} /> },
];

function ShowroomLayout({ children }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const history = useHistory();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('user');
        history.push('/login');
    };

    return (
        <div className="admin-wrapper">
            <aside className="admin-sidebar showroom-sidebar">
                <div className="sidebar-brand">
                    <span className="brand-icon"><Building2 size={24} style={{ color: 'var(--accent-purple)' }} /></span>
                    <span className="brand-name">DriveX</span>
                    <span className="role-chip showroom-chip">Showroom</span>
                </div>
                <nav className="sidebar-nav">
                    {showroomLinks.map((link) => (
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
                        <span className="user-avatar showroom-avatar">{user?.username?.[0]?.toUpperCase()}</span>
                        <div>
                            <Link to="/showroom/profile" style={{ textDecoration: 'none' }}>
                                <div className="user-display-name">{user?.username}</div>
                                <div className="user-role-label">Showroom Settings</div>
                            </Link>
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

export default ShowroomLayout;
