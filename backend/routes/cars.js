const router = require('express').Router();
const { getAllCars, getCarById, addCar, editCar, deleteCar } = require('../controllers/carController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

// Public - anyone logged in can view cars
router.get('/', auth, getAllCars);
router.get('/:id', auth, getCarById);

// Admin or showroom-admin
router.post('/', auth, requireRole('admin', 'showroom-admin'), addCar);
router.put('/:id', auth, requireRole('admin', 'showroom-admin'), editCar);
router.delete('/:id', auth, requireRole('admin', 'showroom-admin'), deleteCar);

module.exports = router;
