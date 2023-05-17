const connection = require('../db/db-connection');
const dict = require("../db/dataDictionary");
const AppError = require('../shared/appError');

function renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

exports.getStatistic = (req, res) => {

    const country = req.params.country;
    const statistic = req.params.statistic;
    const fromYear = req.params.fromyear;
    const toYear = req.params.toyear;
    const dbStatistic = dict.dataBaseName(statistic);
    const dbTable = dict.dataBaseTable(dbStatistic);
    const displayStatistic = dict.FormalName(dbStatistic);

    const query = 
        "select year, " + dbStatistic + " " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' " +
        "and year between " + fromYear + " and " + toYear + " " +
        "order by year;";

    connection.query(query, (err, rows) => {

        if (err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            });
            return;
            // return next(new AppError(err.message, 404));
        }

        const data = JSON.parse(JSON.stringify(rows));
        data.forEach( obj => renameKey( obj, dbStatistic, "stat" ) );

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: displayStatistic,
            results: rows.length,
            data: data
        });
    });
};

exports.getStatisticBySex = (req, res) => {

    /* This queries db table life_expectancy */

    const country = req.params.country;
    const statistic = req.params.statistic;
    const fromYear = req.params.fromyear;
    const toYear = req.params.toyear;
    const sex = req.params.sex;
    
    var dbStatistic = dict.dataBaseName(statistic);
    if (sex === "Male") {
        dbStatistic += "_male";
    } else if (sex === "Female") {
        dbStatistic += "_female";
    } else if (sex !== "Both Sexes") {
        // TODO: handle bad route
        dbStatistic = "unknown";
    }
    
    const dbTable = dict.dataBaseTable(dbStatistic);
    const displayStatistic = dict.FormalName(dbStatistic);

    const query = 
        "select year, " + dbStatistic + " " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' " +
        "and year between " + fromYear + " and " + toYear + " " +
        "order by year;";

    connection.query(query, (err, rows) => {

        if (err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            });
            return;
        }

        const data = JSON.parse(JSON.stringify(rows));
        data.forEach( obj => renameKey( obj, dbStatistic, "stat" ) );

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: displayStatistic,
            results: rows.length,
            data: data
        });
    });
}

exports.getStatisticByAgeGroup = (req, res) => {

    /* This queries db table fertility_rates */

    const country = req.params.country;
    const statistic = req.params.statistic;
    const fromYear = req.params.fromyear;
    const toYear = req.params.toyear;
    const ageGroup = req.params.ageGroup;
    var dbStatistic = dict.dataBaseName(statistic);

    const ages = ["15", "20", "25", "30", "35", "40", "45"];

    if (ages.includes(ageGroup)) {
        dbStatistic += "_" + ageGroup + "_" + (+ageGroup + 4); 
    } else if (ageGroup === "Total") {
        dbStatistic = "total_" + dbStatistic;
    } else {
        dbStatistic = "unknown";
    }

    const dbTable = dict.dataBaseTable(dbStatistic);
    const displayStatistic = dict.FormalName(dbStatistic);

    const query = 
        "select year, " + dbStatistic + " " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' " +
        "and year between " + fromYear + " and " + toYear + " " +
        "order by year;";

    connection.query(query, (err, rows) => {

        if (err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            });
            return;
        }

        const data = JSON.parse(JSON.stringify(rows));
        data.forEach( obj => renameKey( obj, dbStatistic, "stat" ) );

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: displayStatistic,
            results: rows.length,
            data: data
        });
    });
}

exports.getStatisticBySexAndAgeGroup = (req, res) => {

    /* This queries db table midyear_population_5yr */

    const country = req.params.country;
    const statistic = req.params.statistic;
    const fromYear = req.params.fromyear;
    const toYear = req.params.toyear;
    const sex = req.params.sex;
    const startingAge = req.params.ageGroup;
    var dbStatistic = dict.dataBaseName(statistic);

    if (sex === 'Male') {
        dbStatistic += "_male";
    } else if (sex === 'Female') {
        dbStatistic += "_female";
    } else if (sex !== 'Both Sexes') {
        dbStatistic = "unknown";
    }

    const dbTable = dict.dataBaseTable(dbStatistic);
    var displayStatistic = dict.FormalName(dbStatistic);

    const endingAge = startingAge === "100" ? "" : +startingAge + 4;
    const ageGroup = startingAge + "-" + endingAge;
    displayStatistic = displayStatistic.replace(
        "Mid-Year Population", "Mid-Year Population at Ages " + ageGroup)

    const ageGroups = [
        "0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55",
        "60", "65", "70", "75", "80", "85", "90", "95", "100"
    ];
        
    var query = "";
    if (startingAge === "all") {
        query = 
        "select year, " + dbStatistic + " " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' and total_flag='*' " +
        "and year between " + fromYear + " and " + toYear + " " +
        "order by year;";
    } else if (ageGroups.includes(startingAge)) {
        query = 
            "select year, " + dbStatistic + " " +
            "from " + dbTable + " " + 
            "where country_name='" + country + "' and total_flag='A' and " + 
            "starting_age='" + startingAge + "' " +
            "and year between " + fromYear + " and " + toYear + " " +
            "order by year;";
    } else {
        query = "unknown";
    }

    connection.query(query, (err, rows) => {

        if (err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            });
            return;
        }

        const data = JSON.parse(JSON.stringify(rows));
        data.forEach( obj => renameKey( obj, dbStatistic, "stat" ) );

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: displayStatistic,
            results: rows.length,
            data: data
        });
    });
};

exports.getStatisticBySexAndAge = (req, res) => {

    /* This queries db table midyear_population_1yr */

    const country = req.params.country;
    const statistic = req.params.statistic;
    const fromYear = req.params.fromyear;
    const toYear = req.params.toyear;
    const sex = req.params.sex;
    const age = req.params.age;
    var dbStatistic = dict.dataBaseName(statistic);
    const dbTable = dict.dataBaseTable(dbStatistic);
    var displayStatistic = dict.FormalName(dbStatistic);
    
    if (age > 100) {
        //TODO: handle error
    }

    dbStatistic += "_" + age;
    displayStatistic = displayStatistic.replace("at Age", "at Age " + age);
    
    if (sex === "Male") {
        displayStatistic = displayStatistic.replace(
            "[Population]", "[Male Population]");
    } else if (sex === "Female"){
        displayStatistic = displayStatistic.replace(
            "[Population]", "[Female Population]");
    }

    const query = 
        "select year, " + dbStatistic + " " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' and sex='" + sex + "'" + 
        "and year between " + fromYear + " and " + toYear + " " +
        "order by year;";

    connection.query(query, (err, rows) => {

        if (err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            });
            return;
        }

        const data = JSON.parse(JSON.stringify(rows));
        data.forEach( obj => renameKey( obj, dbStatistic, "stat" ) );

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: displayStatistic,
            results: rows.length,
            data: data
        });
    });
};
