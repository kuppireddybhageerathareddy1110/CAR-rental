const Car = require('../models/Car');
const mongoose = require('mongoose');
const moment = require('moment');
const CAR_MODELS = [
    'Mercedes-Benz S-Class', 'BMW M8 Competition', 'Audi RS7', 'Porsche 911 GT3',
    'Lamborghini Huracan', 'Ferrari F8 Tributo', 'McLaren 720S', 'Aston Martin DB11',
    'Bentley Continental GT', 'Rolls-Royce Ghost', 'Range Rover Autobiography',
    'Lexus LC 500', 'Tesla Model S Plaid', 'Maserati GranTurismo', 'Jaguar F-Type',
    'Chevrolet Corvette Z06', 'Nissan GT-R', 'Audi R8 V10', 'Mercedes-AMG GT', 'Porsche Taycan'
];
const CAR_IMAGES = [
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503376713210-6c9ab85c94fa?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563720225384-9c223c683ee3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506061805906-e0ce1d45dc5c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631262569263-547c31d10207?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0b16?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616766479708-66236b28da1b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bc32c0734c89?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566336363553-61b6b55a822f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614002821264-ff1aa3fce93f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606016159991-dde56cb4b2eb?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop'
];
const CATEGORIES = ['Luxury', 'Sports', 'Sedan', 'SUV'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Automatic', 'Manual'];

if (!global.demoCars) {
    global.demoCars = Array.from({ length: 20 }).map((_, i) => ({
        _id: (i + 1).toString(),
        name: CAR_MODELS[i % CAR_MODELS.length],
        image: CAR_IMAGES[i % CAR_IMAGES.length],
        rentPerHour: Math.floor(Math.random() * (6000 - 2000 + 1) + 2000),
        capacity: Math.floor(Math.random() * (5 - 2 + 1) + 2),
        fuelType: FUEL_TYPES[Math.floor(Math.random() * FUEL_TYPES.length)],
        transmission: TRANSMISSIONS[Math.floor(Math.random() * TRANSMISSIONS.length)],
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        bookedTimeSlots: []
    }));
}

// GET /api/cars — all available cars (optionally scoped by showroom)
const getAllCars = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            let temp = [...global.demoCars];
            const sid = req.query.showroomId;

            // If a specific showroom is requested in demo mode, ensure some cars are assigned to it if none exist
            if (sid) {
                const hasCars = temp.some(c => c.showroomId === sid);
                if (!hasCars) {
                    // Assign first 5 cars to this showroom for demo purposes
                    temp.forEach((c, idx) => {
                        if (idx < 5) c.showroomId = sid;
                    });
                }
                temp = temp.filter(c => c.showroomId === sid);
            }

            if (req.query.category) temp = temp.filter(c => c.category === req.query.category);
            if (req.query.fuelType) temp = temp.filter(c => c.fuelType === req.query.fuelType);
            return res.json(temp);
        }

        const filter = {};
        if (req.query.showroomId) filter.showroomId = req.query.showroomId;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.fuelType) filter.fuelType = req.query.fuelType;

        const cars = await Car.find(filter).populate('showroomId', 'name location');
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/cars/:id
const getCarById = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const car = global.demoCars.find(c => c._id === req.params.id);
            if (!car) return res.status(404).json({ message: 'Car not found.' });
            return res.json(car);
        }

        const car = await Car.findById(req.params.id).populate('showroomId', 'name location');
        if (!car) return res.status(404).json({ message: 'Car not found.' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/cars — admin or showroom-admin
const addCar = async (req, res) => {
    try {
        const {
            name, brand, model, variant, year, image, rentPerHour, pricePerDay,
            capacity, fuelType, transmission, category, registrationNumber, color, vin
        } = req.body;

        let showroomId = req.body.showroomId || null;
        // showroom-admin can only add cars to their own showroom
        if (req.user.role === 'showroom-admin') {
            showroomId = req.user.showroomId;
        }

        if (mongoose.connection.readyState !== 1) {
            const newCar = {
                _id: Math.random().toString(36).substr(2, 9),
                name, brand, model, variant, year, image, rentPerHour, pricePerDay,
                capacity, fuelType, transmission: transmission || 'Manual',
                category: category || 'Sedan', registrationNumber, color, vin,
                showroomId, status: 'Available', bookedTimeSlots: [],
            };
            global.demoCars.push(newCar);
            return res.status(201).json({ message: '[Demo] Car added successfully!', car: newCar });
        }

        const car = await Car.create({
            name, brand, model, variant, year, image, rentPerHour, pricePerDay,
            capacity, fuelType, transmission: transmission || 'Manual',
            category: category || 'Sedan', registrationNumber, color, vin,
            showroomId, status: 'Available', bookedTimeSlots: [],
        });
        res.status(201).json({ message: 'Car added successfully!', car });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/cars/:id — admin or owning showroom-admin
const editCar = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const idx = global.demoCars.findIndex(c => c._id === req.params.id);
            if (idx === -1) return res.status(404).json({ message: 'Car not found.' });

            if (req.user.role === 'showroom-admin' && String(global.demoCars[idx].showroomId) !== String(req.user.showroomId)) {
                return res.status(403).json({ message: 'Access denied. Not your showroom car.' });
            }

            global.demoCars[idx] = { ...global.demoCars[idx], ...req.body };
            return res.json({ message: '[Demo] Car updated successfully!', car: global.demoCars[idx] });
        }

        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found.' });

        // showroom-admin can only edit their own showroom's cars
        if (req.user.role === 'showroom-admin' && String(car.showroomId) !== String(req.user.showroomId)) {
            return res.status(403).json({ message: 'Access denied. Not your showroom car.' });
        }

        const updated = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Car updated successfully!', car: updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/cars/:id — admin or owning showroom-admin
const deleteCar = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const idx = global.demoCars.findIndex(c => c._id === req.params.id);
            if (idx === -1) return res.status(404).json({ message: 'Car not found.' });

            if (req.user.role === 'showroom-admin' && String(global.demoCars[idx].showroomId) !== String(req.user.showroomId)) {
                return res.status(403).json({ message: 'Access denied. Not your showroom car.' });
            }

            global.demoCars.splice(idx, 1);
            return res.json({ message: '[Demo] Car deleted successfully.' });
        }

        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found.' });

        if (req.user.role === 'showroom-admin' && String(car.showroomId) !== String(req.user.showroomId)) {
            return res.status(403).json({ message: 'Access denied. Not your showroom car.' });
        }

        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: 'Car deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllCars, getCarById, addCar, editCar, deleteCar };
