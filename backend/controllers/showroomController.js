const Showroom = require('../models/Showroom');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

// GET /api/showroom — admin gets all, showroom-admin gets their own
const getShowrooms = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            if (!global.demoShowrooms) {
                global.demoShowrooms = [
                    { _id: 'sid_1', name: 'Premium Motors', email: 'platinum@drivex.com', phone: '9876543210', address: '123 Luxury Ave', isActive: true },
                    { _id: 'sid_2', name: 'Elite Cars', email: 'elite@drivex.com', phone: '9123456780', address: '456 Elite Blvd', isActive: true }
                ];
            }
            if (req.user.role === 'showroom-admin') {
                return res.json(global.demoShowrooms.filter(s => s._id === req.user.showroomId));
            }
            return res.json(global.demoShowrooms);
        }

        let showrooms;
        if (req.user.role === 'admin') {
            showrooms = await Showroom.find().populate('adminId', 'username email');
        } else {
            showrooms = await Showroom.find({ _id: req.user.showroomId }).populate('adminId', 'username email');
        }
        res.json(showrooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/showroom/:id/stats — showroom stats summary
const getShowroomStats = async (req, res) => {
    try {
        const showroomId = req.user.role === 'showroom-admin' ? req.user.showroomId : req.params.id;

        if (mongoose.connection.readyState !== 1) {
            const cars = global.demoCars.filter(c => c.showroomId === showroomId);
            return res.json({
                totalCars: cars.length,
                totalBookings: 12,
                totalRevenue: 45000,
                totalModels: new Set(cars.map(c => c.model || c.name)).size,
                inventory: [
                    { model: 'Mercedes-Benz S-Class', total: 2, available: 1, rented: 1, maintenance: 0 },
                    { model: 'BMW M8', total: 1, available: 1, rented: 0, maintenance: 0 }
                ],
                utilizationRate: 65,
                maintenanceCount: 2,
                activeBookings: 4
            });
        }
        const [cars, totalBookings, bookings] = await Promise.all([
            Car.find({ showroomId }),
            Booking.countDocuments({ showroomId }),
            Booking.find({ showroomId, paymentStatus: 'paid' }),
        ]);

        const totalCars = cars.length;
        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

        // Utilization & Maintenance
        const maintenanceCount = cars.filter(c => c.maintenanceStatus !== 'Healthy').length;
        const now = moment().format('MMM DD yyyy HH:mm');
        const activeBookings = await Booking.countDocuments({
            showroomId,
            bookingStatus: { $in: ['confirmed', 'in-progress'] },
        });

        // Simulating utilization rate
        const utilizationRate = totalCars > 0 ? Math.round(((activeBookings) / totalCars) * 100) : 0;

        // Inventory Breakdown by Model
        const inventoryMap = {};
        cars.forEach(car => {
            const modelKey = car.model || car.name;
            if (!inventoryMap[modelKey]) {
                inventoryMap[modelKey] = { total: 0, available: 0, rented: 0, maintenance: 0 };
            }
            inventoryMap[modelKey].total++;
            if (car.status === 'Available') inventoryMap[modelKey].available++;
            else if (car.status === 'Rented') inventoryMap[modelKey].rented++;
            else if (car.status === 'Maintenance' || car.maintenanceStatus !== 'Healthy') inventoryMap[modelKey].maintenance++;
        });

        const inventory = Object.keys(inventoryMap).map(model => ({
            model,
            ...inventoryMap[model]
        }));

        res.json({
            totalCars, totalBookings, totalRevenue, totalModels: inventory.length,
            inventory, utilizationRate, maintenanceCount, activeBookings
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/showroom — admin only
const createShowroom = async (req, res) => {
    try {
        const showroom = await Showroom.create(req.body);
        res.status(201).json({ message: 'Showroom created!', showroom });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/showroom/:id — admin only
const updateShowroom = async (req, res) => {
    try {
        const { id } = req.params;

        // Authorization check for showroom-admin
        if (req.user.role === 'showroom-admin' && req.user.showroomId.toString() !== id) {
            return res.status(403).json({ message: 'Unauthorized to update this showroom.' });
        }

        const showroom = await Showroom.findByIdAndUpdate(id, req.body, { new: true });
        if (!showroom) return res.status(404).json({ message: 'Showroom not found.' });
        res.json({ message: 'Showroom updated!', showroom });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/showroom/:id — admin only
const deleteShowroom = async (req, res) => {
    try {
        await Showroom.findByIdAndDelete(req.params.id);
        res.json({ message: 'Showroom deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getShowrooms, getShowroomStats, createShowroom, updateShowroom, deleteShowroom };
