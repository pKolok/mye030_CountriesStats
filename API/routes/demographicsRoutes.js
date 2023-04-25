const express = require('express')

const demographicsController = require('../controllers/demographicsController');

const router = express.Router();

router
    .route('/:country/:statistic')
    .get(demographicsController.getCountryStatistic);

module.exports = router;