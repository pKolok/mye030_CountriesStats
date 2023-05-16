var connection = require('../db/db-connection');
const dict = require("../db/dataDictionary");

exports.getYears = (req, res) => {

    const country = req.params.country;
    const statistic = req.params.statistic;
    const dbStatistic = dict.dataBaseName(statistic);
    const dbTable = dict.dataBaseTable(dbStatistic);
    const displayStatistic = dict.FormalName(dbStatistic);

    const query = 
        "select year " +
        "from " + dbTable + " " + 
        "where country_name='" + country + "' " + 
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