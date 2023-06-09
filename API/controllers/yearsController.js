var connection = require('../db/db-connection');
const dict = require("../db/dataDictionary");

exports.getYears = (req, res) => {

    const country = req.params.country;
    const statistic = req.params.statistic;
    const dbStatistic = dict.dataBaseName(statistic);
    const dbTable = dict.dataBaseTable(dbStatistic);
    const displayStatistic = dict.FormalName(dbStatistic);

    const query = 
        "select distinct year " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' " + 
        "and " + dbStatistic + " is not null " +  
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

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: displayStatistic,
            results: rows.length,
            data: data
        });
    });

};

exports.getYearsBySex = (req, res) => {

    /* This queries db table life_expectancy */

    const country = req.params.country;
    const statistic = req.params.statistic;
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
        "select distinct year " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' "+ 
        "and " + dbStatistic + " is not null " +  
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

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: displayStatistic,
            results: rows.length,
            data: data
        });
    });
}

exports.getYearsByAgeGroup = (req, res) => {

    /* This queries db table fertility_rates */

    const country = req.params.country;
    const statistic = req.params.statistic;
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
        "select distinct year " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' "+ 
        "and " + dbStatistic + " is not null " +  
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

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: displayStatistic,
            results: rows.length,
            data: data
        });
    });
}

exports.getyearsBySexAndAgeGroup = (req, res) => {

    /* This queries db table midyear_population_5yr */

    const country = req.params.country;
    const statistic = req.params.statistic;
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

    // const query = 
    //     "select distinct year " +
    //     "from " + dbTable + " " + 
    //     "where country_name='" + country + "' " + 
    //     "and " + dbStatistic + " is not null " +  
    //     "order by year;";  

    var query = "";
    if (startingAge === "all") {
        query = 
        "select distinct year " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' and total_flag='*' " +
        "and " + dbStatistic + " is not null " + 
        "order by year;";
    } else if (ageGroups.includes(startingAge)) {
        query = 
            "select distinct year " +
            "from " + dbTable + " " + 
            "where country_name='" + country + "' and total_flag='A' and " + 
            "starting_age='" + startingAge + "' " +
            "and " + dbStatistic + " is not null " +
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

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: displayStatistic,
            results: rows.length,
            data: data
        });
    });
};

exports.getYearsBySexAndAge = (req, res) => {

    /* This queries db table midyear_population_1yr */

    const country = req.params.country;
    const statistic = req.params.statistic;
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
        "select distinct year " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' and sex='" + sex + "'" + 
        "and " + dbStatistic + " is not null " +  
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

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: displayStatistic,
            results: rows.length,
            data: data
        });
    });
};
