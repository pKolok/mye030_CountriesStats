const connection = require('../db/db-connection');
const dict = require("../db/dataDictionary");

function renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

exports.getCountryStatistic = (req, res) => {

    const country = req.params.country;
    const statistic = req.params.statistic;
    const dbStatistic = dict.dataBaseName(statistic);
    const dbTable = dict.dataBaseTable(dbStatistic);
    const displayStatistic = dict.FormalName(dbStatistic);

    const query = 
        "select year, " + dbStatistic + " " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' " + 
        "order by year;";

    connection.query(query, (err, rows) => {

        if (err)
            throw err;

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

exports.getCountryStatisticByAgeGroup = (req, res) => {

    const country = req.params.country;
    const statistic = req.params.statistic;
    const age = req.params.age;
    const dbStatistic = dict.dataBaseName(statistic);
    const dbTable = dict.dataBaseTable(dbStatistic);
    const displayStatistic = dict.FormalName(dbStatistic);

    var query = "";

    if (age === "all") {
        query = 
        "select year, " + dbStatistic + " " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' and total_flag='*' " +  
        "order by year;";
    } else {
        query = 
            "select year, " + dbStatistic + " " +
            "from " + dbTable + " " + 
            "where country_name='" + country + "' and total_flag='A' and " + 
                "starting_age='" + age + "'" 
            "order by year;";
    }

    connection.query(query, (err, rows) => {

        if (err)
            throw err;

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

exports.getCountryStatisticBySex = (req, res) => {

    const country = req.params.country;
    const statistic = req.params.statistic;
    const sex = req.params.sex;
    const dbStatistic = dict.dataBaseName(statistic);
    const dbTable = dict.dataBaseTable(dbStatistic);
    const displayStatistic = dict.FormalName(dbStatistic);

    const query = 
        "select year, " + dbStatistic + " " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' and sex='" + sex + "'" + 
        "order by year;";

    connection.query(query, (err, rows) => {

        if (err) 
            throw err;

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