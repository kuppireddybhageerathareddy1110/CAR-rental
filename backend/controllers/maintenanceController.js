const MaintenanceRecord = require('../models/MaintenanceRecord');
const Car = require('../models/Car');

const addMaintenanceRecord = async (req, res) => {
    try {
        const { carId, serviceType, description, cost, date } = req.body;
        const car = await Car.findById(carId);
        if (!car) return res.status(404).json({ message: 'Car not found.' });

        const record = await MaintenanceRecord.create({
            carId,
            showroomId: car.showroomId,
            serviceType,
            description,
            cost,
            date: date || new Date(),
            performedBy: req.user.username
        });

        res.status(201).json({ message: 'Maintenance record added.', record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getCarMaintenanceHistory = async (req, res) => {
    try {
        const records = await MaintenanceRecord.find({ carId: req.params.carId }).sort({ date: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getShowroomMaintenanceHistory = async (req, res) => {
    try {
        const records = await MaintenanceRecord.find({ showroomId: req.user.showroomId })
            .populate('carId', 'name registrationNumber')
            .sort({ date: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { addMaintenanceRecord, getCarMaintenanceHistory, getShowroomMaintenanceHistory };
