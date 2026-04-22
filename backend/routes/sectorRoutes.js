const express = require('express');
const router = express.Router();
const {
    getSectors,
    getSector,
    createSector,
    updateSector,
    deleteSector
} = require('../controllers/sectorController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getSectors)
    .post(createSector);

router.route('/:id')
    .get(getSector)
    .put(updateSector)
    .delete(deleteSector);

module.exports = router;
