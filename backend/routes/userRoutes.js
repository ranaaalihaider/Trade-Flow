const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    getUsers
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.route('/profile')
    .get(protect, getUserProfile);

router.route('/')
    .get(protect, authorize('Admin', 'SuperAdmin'), getUsers);

module.exports = router;
