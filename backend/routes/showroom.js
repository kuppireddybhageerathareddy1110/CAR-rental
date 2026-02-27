const router = require('express').Router();
const {
    getShowrooms,
    getShowroomStats,
    createShowroom,
    updateShowroom,
    deleteShowroom,
} = require('../controllers/showroomController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

// Everyone can view showrooms
router.get('/', auth, getShowrooms);
router.get('/:id/stats', auth, requireRole('admin', 'showroom-admin'), getShowroomStats);

// Admin only: create, update, delete showrooms
router.post('/', auth, requireRole('admin'), createShowroom);
router.put('/:id', auth, requireRole('admin', 'showroom-admin'), updateShowroom);
router.delete('/:id', auth, requireRole('admin'), deleteShowroom);

module.exports = router;
