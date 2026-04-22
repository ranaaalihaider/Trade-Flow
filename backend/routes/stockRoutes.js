const express = require('express');
const router = express.Router();
const { getStocks } = require('../controllers/stockController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getStocks);

module.exports = router;
