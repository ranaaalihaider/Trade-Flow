const express = require('express');
const router = express.Router();
const { getStockReport, getLedgerReport, getDashboardStats } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/stock', getStockReport);
router.get('/ledger/:accountId', getLedgerReport);
router.get('/dashboard', getDashboardStats);

module.exports = router;
