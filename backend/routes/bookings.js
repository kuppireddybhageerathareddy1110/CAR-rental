const router = require('express').Router();
const {
    bookCar,
    getMyBookings,
    getAllBookings,
    getShowroomBookings,
    updateBookingStatus,
    cancelBooking,
    deleteBooking,
    getBookingById,
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

// User: book a car + view own bookings
router.post('/', auth, bookCar);
router.get('/my', auth, getMyBookings);
router.get('/:id', auth, getBookingById);
router.post('/:id/cancel', auth, cancelBooking);

// Admin: all bookings
router.get('/all', auth, requireRole('admin'), getAllBookings);

// Showroom-admin: their showroom's bookings
router.get('/showroom', auth, requireRole('showroom-admin'), getShowroomBookings);

// Admin & Showroom-admin: update booking status
router.patch('/:id/status', auth, requireRole(['admin', 'showroom-admin']), updateBookingStatus);
router.delete('/:id', auth, requireRole('admin'), deleteBooking);

module.exports = router;
