const router = require('express').Router();
const { getCarReviews, addReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/car/:carId', getCarReviews);
router.post('/', auth, addReview);

module.exports = router;
