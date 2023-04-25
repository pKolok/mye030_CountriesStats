var connection = require('../db-connection');

exports.getCountryStatistic = (req, res) => {

    const country = req.params.country;
    const statistic = req.params.statistic;

    const query = 
        "select year, " + statistic + " " +
        "from " + statistic + " " + 
        "where country_name='" + country + "' " + 
        "order by year;";

    connection.query(query, (err, rows) => {

        if (err) throw err;

        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: JSON.parse(JSON.stringify(rows))
        });
    });
};