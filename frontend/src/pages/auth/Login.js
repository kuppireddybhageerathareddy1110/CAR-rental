import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../redux/actions/userActions';
import Spinner from '../../components/common/Spinner';
import { CheckCircle2, Zap, ShieldCheck, User, Lock, Cloud, Sun, Moon, CarFront, Gift, Smartphone, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom Side-View Car SVG for a more premium look
const SideViewCar = ({ color = "#f78d46", size = 180 }) => (
    <svg
        width={size}
        height={size / 2}
        viewBox="0 0 200 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Ground Shadow */}
        <ellipse cx="100" cy="88" rx="75" ry="8" fill="rgba(0,0,0,0.25)" filter="blur(5px)" />

        {/* Car Body Main */}
        <path d="M12 62C12 62 18 42 38 38C58 34 80 18 125 18C170 18 192 38 196 58V65C196 72 190 78 180 78H28C18 78 12 72 12 65V62Z" fill={color} />

        {/* Glossy Reflection (Top) */}
        <path d="M45 40C65 35 90 22 125 22C160 22 180 35 185 45" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />

        {/* Windows Area */}
        <path d="M72 42H112V25C112 25 92 25 72 28V42Z" fill="#0f172a" />
        <path d="M118 42H165C165 42 160 28 118 25V42Z" fill="#0f172a" />

        {/* Window Highlights */}
        <path d="M125 28L155 42H162L132 28H125Z" fill="rgba(255,255,255,0.15)" />

        {/* Door Details */}
        <path d="M115 42V78" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <rect x="118" y="58" width="15" height="4" rx="2" fill="rgba(0,0,0,0.2)" />

        {/* Lights */}
        <path d="M192 52L196 52C198 52 198 62 196 62L192 62V52Z" fill="#fbbf24" /> {/* Headlight */}
        <path d="M12 52L8 52C6 52 6 62 8 62L12 62V52Z" fill="#ef4444" /> {/* Tail light */}

        {/* Wheels with 3D feel */}
        <g className="wheel-front">
            <circle cx="52" cy="75" r="18" fill="#1e293b" />
            <circle cx="52" cy="75" r="14" fill="#334155" />
            <circle cx="52" cy="75" r="12" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,3" />
            <circle cx="52" cy="75" r="4" fill="#64748b" />
        </g>
        <g className="wheel-back">
            <circle cx="152" cy="75" r="18" fill="#1e293b" />
            <circle cx="152" cy="75" r="14" fill="#334155" />
            <circle cx="152" cy="75" r="12" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,3" />
            <circle cx="152" cy="75" r="4" fill="#64748b" />
        </g>
    </svg>
);

function Login() {
    const dispatch = useDispatch();
    const { loading } = useSelector((s) => s.alertsReducer);
    const [form, setForm] = useState({ username: '', password: '' });

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(userLogin(form));
    };

    return (
        <div className="auth-page">
            {loading && <Spinner />}
            <div className="auth-left">
                {/* Aura Background System */}
                <div className="aura-container">
                    <div className="aura-blob aura-blob-1"></div>
                    <div className="aura-blob aura-blob-2"></div>
                    <div className="aura-blob aura-blob-3"></div>
                    <div className="noise-overlay"></div>
                </div>

                <div className="auth-left-bg" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="auth-hero-graphics"
                    >
                        <div className="animation-container" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Moving Clouds */}
                            <motion.div
                                animate={{ x: [-300, 1200] }}
                                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                                style={{ position: 'absolute', top: '10%', opacity: 0.1 }}
                            >
                                <Cloud size={100} color="white" />
                            </motion.div>

                            {/* The Car Group */}
                            <motion.div
                                className="motion-car"
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, type: "spring" }}
                                style={{ zIndex: 10, marginTop: '120px' }}
                            >
                                <SideViewCar size={260} />
                            </motion.div>

                            {/* Road Line */}
                            <div style={{ position: 'absolute', bottom: '35%', width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
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
                        Welcome back <br />
                        <span className="gradient-text-aura">To Elite Class</span>
                    </h1>

                    <p className="auth-subtext">
                        Your journey continues here. Log in to manage your luxury fleet and exclusive bookings.
                    </p>

                    <div className="auth-features-v2">
                        {[
                            { icon: <ShieldCheck size={24} />, title: "Secure Access", desc: "Enterprise-grade encryption for your data", color: "blue" },
                            { icon: <Zap size={24} />, title: "Instant Access", desc: "No delays, just direct control of your fleet", color: "purple" }
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (i * 0.15), duration: 0.6 }}
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
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Sign in to your account</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <div className="input-wrap">
                                <span className="input-icon"><User size={16} /></span>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-input"
                                    placeholder="Enter your username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrap">
                                <span className="input-icon"><Lock size={16} /></span>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-gradient-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </div >
    );
}

export default Login;
