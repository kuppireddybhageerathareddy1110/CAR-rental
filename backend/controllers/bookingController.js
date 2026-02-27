const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');
const moment = require('moment');

// POST /api/bookings — user creates a booking
const bookCar = async (req, res) => {
    try {
        const { carId, bookedTimeSlots, totalHours, totalAmount, driverRequired, transactionId } = req.body;

        const [car, user] = await Promise.all([
            Car.findById(carId),
            User.findById(req.user.id)
        ]);

        if (!car) return res.status(404).json({ message: 'Car not found.' });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Mandatory Verification Check
        if (!user.isVerified) {
            return res.status(400).json({
                message: 'Booking denied. Please upload your driving license and wait for admin verification in your profile.'
            });
        }

        // Maintenance Check
        if (car.maintenanceStatus !== 'Healthy') {
            return res.status(400).json({
                message: `This car is currently ${car.maintenanceStatus.toLowerCase()} and cannot be booked.`
            });
        }

        // Check for time slot conflicts
        const selectedFrom = moment(bookedTimeSlots.from, 'MMM DD yyyy HH:mm');
        const selectedTo = moment(bookedTimeSlots.to, 'MMM DD yyyy HH:mm');

        for (const slot of car.bookedTimeSlots) {
            const slotFrom = moment(slot.from, 'MMM DD yyyy HH:mm');
            const slotTo = moment(slot.to, 'MMM DD yyyy HH:mm');

            if (
                selectedFrom.isBetween(slotFrom, slotTo) ||
                selectedTo.isBetween(slotFrom, slotTo) ||
                slotFrom.isBetween(selectedFrom, selectedTo) ||
                slotTo.isBetween(selectedFrom, selectedTo)
            ) {
                return res.status(400).json({ message: 'This time slot is already booked.' });
            }
        }

        // Add time slot to car
        car.bookedTimeSlots.push({ from: bookedTimeSlots.from, to: bookedTimeSlots.to });
        await car.save();

        // Create booking
        let finalShowroomId = car.showroomId;
        if (!finalShowroomId || finalShowroomId === "" || finalShowroomId === "null") {
            finalShowroomId = null;
        }

        // Calculate Credits (5% of totalAmount)
        const creditAward = Math.floor(totalAmount * 0.05);

        const booking = await Booking.create({
            user: req.user.id,
            car: carId,
            showroomId: finalShowroomId,
            bookedTimeSlots,
            totalHours,
            totalAmount,
            driverRequired: driverRequired || false,
            transactionId: transactionId || '',
            paymentStatus: transactionId ? 'paid' : 'pending',
            creditsEarned: creditAward,
        });

        // Award credits to user
        user.credits = (user.credits || 0) + creditAward;
        await user.save();

        res.status(201).json({ message: 'Car booked successfully!', booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/bookings/my — user's own bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('car', 'name image rentPerHour fuelType capacity')
            .populate('showroomId', 'name location')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/bookings/all — admin: all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'username email role')
            .populate('car', 'name image rentPerHour')
            .populate('showroomId', 'name location')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/bookings/showroom — showroom-admin: only their showroom's bookings
const getShowroomBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ showroomId: req.user.showroomId })
            .populate('user', 'username email')
            .populate('car', 'name image rentPerHour')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingStatus } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found.' });

        // Authorization check for showroom-admin
        if (req.user.role === 'showroom-admin' && booking.showroomId?.toString() !== req.user.showroomId?.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this booking.' });
        }

        // Handle car status sync based on booking state
        const car = await Car.findById(booking.car);
        if (car) {
            if (bookingStatus === 'picked-up') {
                car.status = 'Rented';
                await car.save();
            } else if (bookingStatus === 'returned' || bookingStatus === 'completed') {
                car.status = 'Available';
                await car.save();
            }

            // Handle transition to completed (cleanup slots)
            if (bookingStatus === 'completed' && booking.bookingStatus !== 'completed') {
                car.bookedTimeSlots = car.bookedTimeSlots.filter(slot =>
                    slot.from !== booking.bookedTimeSlots.from || slot.to !== booking.bookedTimeSlots.to
                );
                await car.save();
            }
        }

        booking.bookingStatus = bookingStatus;
        await booking.save();

        res.json({ message: 'Booking status updated.', booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/bookings/:id/cancel — user can cancel their booking
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found.' });

        // Ensure user is the owner of the booking
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to cancel this booking.' });
        }

        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled.' });
        }

        // Update booking status
        booking.bookingStatus = 'cancelled';
        await booking.save();

        // Revert credits if they were awarded
        if (booking.creditsEarned > 0) {
            const user = await User.findById(booking.user);
            if (user) {
                user.credits = Math.max(0, (user.credits || 0) - booking.creditsEarned);
                await user.save();
            }
        }

        // Remove time slot from car
        const car = await Car.findById(booking.car);
        if (car) {
            car.bookedTimeSlots = car.bookedTimeSlots.filter(slot =>
                slot.from !== booking.bookedTimeSlots.from || slot.to !== booking.bookedTimeSlots.to
            );
            await car.save();
        }

        res.json({ message: 'Booking cancelled successfully.', booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/bookings/:id — admin can delete a booking record
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found.' });

        // Remove time slot from car if not already cancelled/completed
        if (booking.bookingStatus !== 'cancelled') {
            const car = await Car.findById(booking.car);
            if (car) {
                car.bookedTimeSlots = car.bookedTimeSlots.filter(slot =>
                    slot.from !== booking.bookedTimeSlots.from || slot.to !== booking.bookedTimeSlots.to
                );
                await car.save();
            }
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking record deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/bookings/:id — get a single booking detail
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'username email phone address')
            .populate('car', 'name image rentPerHour brand')
            .populate('showroomId', 'name location');
        if (!booking) return res.status(404).json({ message: 'Booking not found.' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { bookCar, getMyBookings, getAllBookings, getShowroomBookings, updateBookingStatus, cancelBooking, deleteBooking, getBookingById };
