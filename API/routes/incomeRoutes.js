const express = require('express')

const incomeController = require('../controllers/incomeController');

const router = express.Router();

router
    .route('/:country/:statistic')
    .get(incomeController.getCountryStatistic);

module.exports = router;