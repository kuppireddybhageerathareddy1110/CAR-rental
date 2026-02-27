import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { CarFront, LogOut, Sun, Moon } from 'lucide-react';

function DefaultLayout({ children }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const history = useHistory();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        history.push('/login');
    };

    return (
        <div className="app-wrapper">
            <nav className="navbar glass-nav">
                <div className="nav-container">
                    <Link to="/" className="nav-brand">
                        <span className="brand-icon"><CarFront size={24} style={{ color: 'var(--accent-blue)' }} /></span>
                        <span className="brand-name">DriveX</span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Browse Cars</Link>
                        <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                        <Link to="/showrooms" className="nav-link">Showrooms</Link>
                    </div>
                    <div className="nav-user">
                        <button className="btn-theme-toggle" onClick={toggleTheme} title="Toggle Theme">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <span className="user-badge">{user?.username?.[0]?.toUpperCase()}</span>
                        <span className="user-name" style={{ marginRight: '16px' }}>{user?.username}</span>
                        <Link to="/profile" className="nav-link" style={{ marginRight: '16px' }}>Profile</Link>
                        <button className="btn-logout" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LogOut size={14} /> Logout</button>
                    </div>
                </div>
            </nav>

            <main className="main-content">{children}</main>

            <footer className="app-footer">
                <div className="footer-content">
                    <span className="brand-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CarFront size={20} style={{ color: 'var(--accent-blue)' }} /> DriveX</span>
                    <span className="footer-tagline">Premium Car Rental Platform</span>
                    <span className="footer-copy">© 2024 DriveX. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
}

export default DefaultLayout;
