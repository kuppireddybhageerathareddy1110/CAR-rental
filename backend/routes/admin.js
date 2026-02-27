const router = require('express').Router();
const { getStats, getAllUsers, updateUser, deleteUser, createUser } = require('../controllers/adminController');
const { scrapeCars } = require('../controllers/scrapeController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

// All admin routes require admin role
router.use(auth, requireRole('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/scrape-cars', scrapeCars);

module.exports = router;
