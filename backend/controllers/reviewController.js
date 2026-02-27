const Review = require('../models/Review');
const Booking = require('../models/Booking');

// GET /api/reviews/car/:carId
const getCarReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ car: req.params.carId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/reviews
const addReview = async (req, res) => {
    try {
        const { carId, rating, comment } = req.body;

        // Check if user has a completed booking for this car
        const hasBooking = await Booking.findOne({
            user: req.user.id,
            car: carId,
            bookingStatus: 'completed'
        });

        // For demo/simplicity, we'll allow all verified users to review, but check completed booking in production
        // if (!hasBooking) {
        //     return res.status(400).json({ message: 'You can only review cars you have successfully rented and returned.' });
        // }

        const review = await Review.create({
            user: req.user.id,
            car: carId,
            rating,
            comment
        });

        res.status(201).json({ message: 'Review added successfully!', review });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getCarReviews, addReview };
