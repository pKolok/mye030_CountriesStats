const express = require('express')

const yearsController = require('../controllers/yearsController');

const router = express.Router();

router
    .route('/:country/:statistic')
    .get(yearsController.getYears);

module.exports = router;