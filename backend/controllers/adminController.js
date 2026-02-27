const User = require('../models/User');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Showroom = require('../models/Showroom');

// GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const [totalUsers, totalCars, totalBookings, totalShowrooms, paidBookings] = await Promise.all([
            User.countDocuments(),
            Car.countDocuments(),
            Booking.countDocuments(),
            Showroom.countDocuments(),
            Booking.find({ paymentStatus: 'paid' }).populate('showroomId', 'name').populate('car', 'name'),
        ]);

        const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);

        // Revenue by showroom
        const revenueByShowroom = {};
        paidBookings.forEach(b => {
            const name = b.showroomId?.name || 'Unknown';
            revenueByShowroom[name] = (revenueByShowroom[name] || 0) + b.totalAmount;
        });

        // Popular models (most booked)
        const modelBookings = {};
        paidBookings.forEach(b => {
            const model = b.car?.name || 'Unknown';
            modelBookings[model] = (modelBookings[model] || 0) + 1;
        });
        const popularModels = Object.entries(modelBookings)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([model, count]) => ({ model, count }));

        res.json({
            totalUsers, totalCars, totalBookings, totalShowrooms, totalRevenue,
            revenueByShowroom: Object.entries(revenueByShowroom).map(([name, amount]) => ({ name, amount })),
            popularModels
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('showroomId', 'name');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/users/:id — update role, showroomId, isActive
const updateUser = async (req, res) => {
    try {
        const { role, showroomId, isActive, isVerified } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role, showroomId: showroomId || null, isActive, isVerified },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json({ message: 'User updated.', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user.id)
            return res.status(400).json({ message: 'Cannot delete yourself.' });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/admin/users — create admin/showroom-admin accounts
const createUser = async (req, res) => {
    try {
        const { username, email, password, role, showroomId } = req.body;
        const exists = await User.findOne({ username });
        if (exists) return res.status(400).json({ message: 'Username already taken.' });

        const user = await User.create({
            username, email,
            password,
            role: role || 'user',
            showroomId: showroomId || null,
        });
        res.status(201).json({
            message: 'User created successfully.',
            user: { id: user._id, username: user.username, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getStats, getAllUsers, updateUser, deleteUser, createUser };
