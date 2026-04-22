const express = require('express');
const router = express.Router();
const {
    getBusinesses,
    getBusiness,
    createBusiness,
    updateBusiness,
    deleteBusiness
} = require('../controllers/businessController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
    .get(authorize('SuperAdmin'), getBusinesses)
    .post(authorize('SuperAdmin'), createBusiness);

router.route('/:id')
    .get(getBusiness)
    .put(authorize('SuperAdmin', 'Admin'), updateBusiness)
    .delete(authorize('SuperAdmin'), deleteBusiness);

module.exports = router;
