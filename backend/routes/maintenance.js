const router = require('express').Router();
const { addMaintenanceRecord, getCarMaintenanceHistory, getShowroomMaintenanceHistory } = require('../controllers/maintenanceController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

router.post('/', auth, requireRole('showroom-admin', 'admin'), addMaintenanceRecord);
router.get('/car/:carId', auth, getCarMaintenanceHistory);
router.get('/showroom', auth, requireRole('showroom-admin', 'admin'), getShowroomMaintenanceHistory);

module.exports = router;
