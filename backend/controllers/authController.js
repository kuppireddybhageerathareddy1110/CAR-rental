const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) =>
    jwt.sign(
        { id: user._id, username: user.username, role: user.role, showroomId: user.showroomId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { username, email, password, cpassword } = req.body;

        if (password !== cpassword)
            return res.status(400).json({ message: 'Passwords do not match.' });

        const exists = await User.findOne({ username });
        if (exists)
            return res.status(400).json({ message: 'Username already taken.' });

        // Only 'user' role can self-register; admin/showroom-admin created by admin
        const user = await User.create({ username, email, password, role: 'user' });

        res.status(201).json({
            message: 'Registration successful!',
            token: generateToken(user),
            user: { id: user._id, username: user.username, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed.', error: err.message });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // --- DUMMY BYPASS FOR UI TESTING ---
        if (username === 'test' && password === 'test') {
            const dummyUser = { id: 'dummy_id_123', username: 'test', role: 'admin' };
            const dummyToken = jwt.sign(dummyUser, process.env.JWT_SECRET || 'dummy_secret', { expiresIn: '1d' });
            return res.status(200).json({ token: dummyToken, user: dummyUser });
        }
        // ------------------------------------

        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({ message: 'Invalid username or password.' });

        if (!user.isActive)
            return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid username or password.' });

        res.json({
            message: 'Login successful!',
            token: generateToken(user),
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                showroomId: user.showroomId,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed.', error: err.message });
    }
};

// GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('showroomId', 'name location');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const { phone, address, drivingLicense } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (drivingLicense) user.drivingLicense = drivingLicense;

        await user.save();
        res.json({ message: 'Profile updated successfully!', user: { id: user._id, username: user.username, role: user.role, phone: user.phone, address: user.address, drivingLicense: user.drivingLicense } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { register, login, getMe, updateProfile };
