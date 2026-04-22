const express = require('express');
const router = express.Router();
const { getAccounts, getAccount, createAccount } = require('../controllers/accountController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getAccounts)
    .post(createAccount);

router.route('/:id')
    .get(getAccount);

module.exports = router;
