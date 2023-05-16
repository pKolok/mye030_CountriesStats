const express = require('express')

const demographicsController = require('../controllers/demographicsController');

const router = express.Router();

router
    .route('/:country/:statistic/:fromyear/:toyear')
    .get(demographicsController.getCountryStatistic);

router
    .route('/:country/:statistic/:fromyear/:toyear/starting-age/:age')
    .get(demographicsController.getCountryStatisticByAgeGroup);

router
    .route('/:country/:statistic/:fromyear/:toyear/:sex')
    .get(demographicsController.getCountryStatisticBySex);


module.exports = router;