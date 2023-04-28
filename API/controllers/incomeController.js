var connection = require('../db/db-connection');
const dict = require("../db/dictionary");

function renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

exports.getCountryStatistic = (req, res) => {

    const country = req.params.country;
    const statistic = req.params.statistic;
    const dbStatistic = dict.dataBaseName(statistic);

    const query = 
        "select year, " + dbStatistic + " " +
        "from " + dbStatistic + " " + 
        "where country_name='" + country + "' " + 
        "order by year;";

    connection.query(query, (err, rows) => {

        if (err) throw err;

        const data = JSON.parse(JSON.stringify(rows));
        data.forEach( obj => renameKey( obj, dbStatistic, "stat" ) );

        res.status(200).json({
            status: 'success',
            country: country,
            statistic: dict.FormalName(dbStatistic),
            results: rows.length,
            data: data
        });
    });
};