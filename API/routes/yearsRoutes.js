const express = require('express')

const yearsController = require('../controllers/yearsController');

const router = express.Router();

// Years by country and statistic 
router
    .route('/:country/:statistic')
    .get(yearsController.getYears);

// Years by country, statistic and sex
router
    .route('/:country/:statistic/:sex')
    .get(yearsController.getYearsBySex);

// Years by country, statistic and age group (starting age)
router
    .route('/:country/:statistic/age-group/:ageGroup')
    .get(yearsController.getYearsByAgeGroup);
  
// Years by country, statistic, sex and age
router
    .route('/:country/:statistic/:sex/age/:age')
    .get(yearsController.getYearsBySexAndAge);

// Years by country, statistic, sex and age group (starting age)
router
    .route('/:country/:statistic/:sex/age-group/:ageGroup')
    .get(yearsController.getyearsBySexAndAgeGroup);

module.exports = router;