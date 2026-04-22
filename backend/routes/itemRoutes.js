const express = require('express');
const router = express.Router();
const {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
} = require('../controllers/itemController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getItems)
    .post(createItem);

router.route('/:id')
    .get(getItem)
    .put(updateItem)
    .delete(deleteItem);

module.exports = router;
