const express = require('express');
const router = express.Router();
const {
    getSalesmen,
    getSalesman,
    createSalesman,
    updateSalesman,
    deleteSalesman
} = require('../controllers/salesmanController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getSalesmen)
    .post(createSalesman);

router.route('/:id')
    .get(getSalesman)
    .put(updateSalesman)
    .delete(deleteSalesman);

module.exports = router;
