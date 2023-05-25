var connection = require('../db/db-connection');

exports.getAllCountries = (req, res) => {

    const query = "select display_name from countries;";
    connection.query(query, (err, rows) => {

        if (err) throw err;

        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                countries: JSON.parse(JSON.stringify(rows))
            }
        });
    });
};