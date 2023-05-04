const express = require('express')

const demographicsController = require('../controllers/demographicsController');

const router = express.Router();

router
    .route('/:country/:statistic')
    .get(demographicsController.getCountryStatistic);

router
    .route('/:country/:statistic/starting-age/:age')
    .get(demographicsController.getCountryStatisticByAgeGroup);

router
    .route('/:country/:statistic/:sex')
    .get(demographicsController.getCountryStatisticBySex);


module.exports = router;