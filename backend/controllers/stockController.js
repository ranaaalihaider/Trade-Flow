const asyncHandler = require('express-async-handler');
const Stock = require('../models/Stock');

const getStocks = asyncHandler(async (req, res) => {
    const stocks = await Stock.find({ businessId: req.user.businessId })
        .populate({
            path: 'itemId',
            select: 'name units prices categoryId companyId',
            populate: [
                { path: 'companyId', select: 'name' },
                { path: 'categoryId', select: 'name' }
            ]
        });
    res.status(200).json(stocks);
});

module.exports = { getStocks };
