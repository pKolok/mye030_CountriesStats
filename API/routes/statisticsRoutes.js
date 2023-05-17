const express = require('express')

const statisticsController = require('../controllers/statisticsController');

const router = express.Router();

// Statistic by years only
router
    .route('/:country/:statistic/:fromyear/:toyear')
    .get(statisticsController.getStatistic);

// Statistic by years and sex
router
    .route('/:country/:statistic/:fromyear/:toyear/:sex')
    .get(statisticsController.getStatisticBySex);

// Statistic by years and age group (starting age)
router
    .route('/:country/:statistic/:fromyear/:toyear/age-group/:ageGroup')
    .get(statisticsController.getStatisticByAgeGroup);
  
// Statistic by years, sex and age
router
    .route('/:country/:statistic/:fromyear/:toyear/:sex/age/:age')
    .get(statisticsController.getStatisticBySexAndAge);

// Statistic by years, sex and age group (starting age)
router
    .route('/:country/:statistic/:fromyear/:toyear/:sex/age-group/:ageGroup')
    .get(statisticsController.getStatisticBySexAndAgeGroup);   

module.exports = router;