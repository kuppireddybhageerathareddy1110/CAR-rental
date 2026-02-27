import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userRegister } from '../../redux/actions/userActions';
import Spinner from '../../components/common/Spinner';
import { CarFront, Gift, Smartphone, Star, User, Lock, CheckCircle2, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

function Register() {
    const dispatch = useDispatch();
    const { loading } = useSelector((s) => s.alertsReducer);
    const [form, setForm] = useState({ username: '', password: '', cpassword: '' });
    const [showPass, setShowPass] = useState(false);

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.cpassword) return alert('Passwords do not match!');
        dispatch(userRegister(form));
    };

    return (
        <div className="auth-page">
            {loading && <Spinner />}
            <div className="auth-left register-left">
                {/* Aura Background System */}
                <div className="aura-container">
                    <div className="aura-blob aura-blob-1"></div>
                    <div className="aura-blob aura-blob-2"></div>
                    <div className="aura-blob aura-blob-3"></div>
                    <div className="noise-overlay"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="auth-left-content"
                >
                    <div className="auth-brand">
                        <div className="glass-icon-wrapper">
                            <CarFront size={32} />
                        </div>
                        <span>DriveX</span>
                    </div>

                    <h1 className="auth-headline">
                        Unlock <br />
                        <span className="gradient-text-aura">New Horizons</span>
                    </h1>

                    <p className="auth-subtext">
                        Experience the pinnacle of automotive luxury. Join DriveX and gain exclusive access to our world-class fleet.
                    </p>

                    <div className="auth-features-v2">
                        {[
                            { icon: <Gift size={24} />, title: "First Ride Honor", desc: "Enjoy 20% off on your debut booking", color: "purple" },
                            { icon: <Smartphone size={24} />, title: "Digital Concierge", desc: "Real-time car tracking & instant support", color: "blue" },
                            { icon: <Star size={24} />, title: "Elite Fleet", desc: "Only the latest models, meticulously kept", color: "amber" }
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + (i * 0.15), duration: 0.6 }}
                                className={`feature-item-v2 glass-card-aura f-${f.color}`}
                            >
                                <div className="feature-icon-v3">
                                    {f.icon}
                                </div>
                                <div>
                                    <div className="feature-title">{f.title}</div>
                                    <div className="feature-desc">{f.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="auth-right">
                <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100 }}>
                    <button className="btn-theme-toggle" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
                <div className="auth-card glass-card">
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Get started for free</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <div className="input-wrap">
                                <span className="input-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} /></span>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-input"
                                    placeholder="Choose a username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrap">
                                <span className="input-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={16} /></span>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    className="form-input"
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-wrap">
                                <span className="input-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={16} /></span>
                                <input
                                    type="password"
                                    name="cpassword"
                                    className="form-input"
                                    placeholder="Confirm your password"
                                    value={form.cpassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-gradient-full" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account →'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
