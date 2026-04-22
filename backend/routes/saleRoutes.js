const express = require('express');
const router = express.Router();
const { getSales, createSale } = require('../controllers/saleController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getSales)
    .post(createSale);

module.exports = router;
